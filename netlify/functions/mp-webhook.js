const { MercadoPagoConfig, Payment } = require('mercadopago');

const SUPABASE_URL = 'https://mvtdzqjtbmgvhdoouhjw.supabase.co';

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const body = JSON.parse(event.body || '{}');

  if (body.type !== 'payment' || !body.data?.id) {
    return { statusCode: 200, body: 'OK' };
  }

  const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  const SUPABASE_KEY = process.env.SUPABASE_SERVICE_KEY;

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
    const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });
    const mpPago = new Payment(client);
    const pago   = await mpPago.get({ id: body.data.id });

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

    return { statusCode: 200, body: 'OK' };

  } catch (err) {
    console.error('Error en webhook MP:', err);
    return { statusCode: 500, body: err.message };
  }
};
