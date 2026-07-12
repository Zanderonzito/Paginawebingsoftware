const { MercadoPagoConfig, Payment } = require('mercadopago');

const SUPABASE_URL = 'https://mvtdzqjtbmgvhdoouhjw.supabase.co';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = JSON.parse(event.body || '{}');

  // MercadoPago envía type="payment" cuando hay una notificación de pago
  if (body.type !== 'payment' || !body.data?.id) {
    return { statusCode: 200, body: 'OK' };
  }

  const ACCESS_TOKEN      = process.env.MP_ACCESS_TOKEN;
  const SUPABASE_KEY      = process.env.SUPABASE_SERVICE_KEY;
  const RESEND_API_KEY    = process.env.RESEND_API_KEY;

  if (!ACCESS_TOKEN || !SUPABASE_KEY) {
    console.error('Faltan variables de entorno: MP_ACCESS_TOKEN o SUPABASE_SERVICE_KEY');
    return { statusCode: 500, body: 'Missing env vars' };
  }

  const sbHeaders = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=minimal',
  };

  try {
    // 1. Obtener datos del pago desde MercadoPago
    const client  = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });
    const mpPago  = new Payment(client);
    const pago    = await mpPago.get({ id: body.data.id });

    if (pago.status !== 'approved') {
      return { statusCode: 200, body: `Pago ${pago.status}, ignorando` };
    }

    const codigoPedido = pago.external_reference;
    if (!codigoPedido) {
      return { statusCode: 200, body: 'Sin external_reference, ignorando' };
    }

    // 2. Buscar el pedido en Supabase
    const pedidoRes = await fetch(
      `${SUPABASE_URL}/rest/v1/pedidos?codigo=eq.${encodeURIComponent(codigoPedido)}&select=*`,
      { headers: sbHeaders }
    );
    const pedidos = await pedidoRes.json();
    const pedido  = pedidos[0];

    if (!pedido) {
      console.error(`Pedido ${codigoPedido} no encontrado`);
      return { statusCode: 200, body: 'Pedido no encontrado' };
    }

    // Evitar procesar el mismo pago dos veces
    if (pedido.estado === 'pagado') {
      return { statusCode: 200, body: 'Ya procesado' };
    }

    // 3. Actualizar estado del pedido a "pagado"
    await fetch(
      `${SUPABASE_URL}/rest/v1/pedidos?codigo=eq.${encodeURIComponent(codigoPedido)}`,
      {
        method: 'PATCH',
        headers: sbHeaders,
        body: JSON.stringify({ estado: 'pagado' }),
      }
    );

    // 4. Descontar stock de cada producto
    for (const item of (pedido.items || [])) {
      if (!item.producto_id) continue;
      const prodRes = await fetch(
        `${SUPABASE_URL}/rest/v1/productos?id=eq.${item.producto_id}&select=id,stock`,
        { headers: sbHeaders }
      );
      const prods = await prodRes.json();
      const prod  = prods[0];
      if (!prod) continue;

      const nuevoStock = Math.max(0, (prod.stock || 0) - item.cantidad);
      await fetch(
        `${SUPABASE_URL}/rest/v1/productos?id=eq.${item.producto_id}`,
        {
          method: 'PATCH',
          headers: sbHeaders,
          body: JSON.stringify({ stock: nuevoStock }),
        }
      );
    }

    // 5. Enviar email de confirmación al comprador
    if (RESEND_API_KEY && pedido.cliente_email) {
      const total = (pedido.items || []).reduce((s, i) => s + i.precio_clp * i.cantidad, 0);
      const itemsHtml = (pedido.items || []).map(i => `
        <tr>
          <td style="padding:10px 0;border-bottom:1px solid #1e4a4b;color:#f3ece1;">${i.nombre}</td>
          <td style="padding:10px 0;border-bottom:1px solid #1e4a4b;text-align:center;color:#f3ece1;">${i.cantidad}</td>
          <td style="padding:10px 0;border-bottom:1px solid #1e4a4b;text-align:right;color:#f3ece1;">$ ${(i.precio_clp * i.cantidad).toLocaleString('es-CL')}</td>
        </tr>`).join('');

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Mujer Cobra <hola@mujercobra.cl>',
          to:   [pedido.cliente_email],
          subject: `✅ Pedido ${codigoPedido} confirmado — Mujer Cobra`,
          html: `
<div style="font-family:Georgia,serif;background:#0b2a2b;color:#f3ece1;padding:40px;max-width:560px;margin:0 auto;border-radius:4px;">
  <h1 style="font-size:1.5rem;margin:0 0 4px;">Mujer Cobra</h1>
  <p style="color:#c97a4b;margin:0 0 24px;font-style:italic;font-size:0.9rem;">El Arte de Creer y Crear</p>
  <hr style="border:none;border-top:1px solid #1e4a4b;margin-bottom:24px;">

  <h2 style="font-size:1.1rem;margin-bottom:8px;">¡Tu pago fue aprobado, ${pedido.cliente_nombre}!</h2>
  <p style="color:rgba(243,236,225,0.6);font-size:0.9rem;margin-bottom:20px;">
    Código de pedido: <strong style="color:#c97a4b;">${codigoPedido}</strong>
  </p>

  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
    <thead>
      <tr style="color:#c97a4b;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;">
        <th style="text-align:left;padding-bottom:8px;border-bottom:1px solid #c97a4b;">Producto</th>
        <th style="text-align:center;padding-bottom:8px;border-bottom:1px solid #c97a4b;">Cant.</th>
        <th style="text-align:right;padding-bottom:8px;border-bottom:1px solid #c97a4b;">Total</th>
      </tr>
    </thead>
    <tbody>${itemsHtml}</tbody>
  </table>
  <div style="text-align:right;font-size:1rem;font-weight:bold;margin-bottom:24px;">
    Total pagado: $ ${total.toLocaleString('es-CL')} CLP
  </div>

  <hr style="border:none;border-top:1px solid #1e4a4b;margin-bottom:20px;">

  <div style="background:#103b3c;border-left:3px solid #c97a4b;padding:18px 20px;border-radius:2px;">
    <strong style="color:#c97a4b;">📦 Coordinación de envío</strong>
    <p style="margin:10px 0 6px;color:rgba(243,236,225,0.8);font-size:0.88rem;line-height:1.6;">
      El envío se coordina directamente con nosotras según tu ubicación y los productos que compraste.
      Por favor contáctanos para cotizarlo:
    </p>
    <ul style="margin:0;padding-left:18px;color:rgba(243,236,225,0.8);font-size:0.88rem;line-height:1.8;">
      <li>Correo: <a href="mailto:hola@mujercobra.cl" style="color:#c97a4b;">hola@mujercobra.cl</a></li>
      <li>Instagram: <a href="https://instagram.com/mujercobra" style="color:#c97a4b;">@mujercobra</a></li>
      <li>WhatsApp: <a href="https://wa.me/56900000000" style="color:#c97a4b;">+56 9 0000 0000</a></li>
    </ul>
    <p style="margin:10px 0 0;color:rgba(243,236,225,0.5);font-size:0.8rem;">
      Menciona tu código de pedido <strong>${codigoPedido}</strong> al contactarnos.
    </p>
  </div>

  <p style="font-size:0.75rem;color:rgba(243,236,225,0.3);margin-top:28px;text-align:center;">
    © 2026 Mujer Cobra · Chile · hola@mujercobra.cl
  </p>
</div>`,
        }),
      });
    }

    return { statusCode: 200, body: 'OK' };

  } catch (err) {
    console.error('Error en webhook MP:', err);
    return { statusCode: 500, body: err.message };
  }
};
