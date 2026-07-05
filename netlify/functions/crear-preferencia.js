const { MercadoPagoConfig, Preference } = require('mercadopago');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const origin = event.headers['origin'] || event.headers['Origin'] || '';
  const allowedOrigins = [
    'https://mujercobra.cl',
    'https://www.mujercobra.cl',
    'http://localhost:8888',
  ];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://mujercobra.cl';
  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
  if (!ACCESS_TOKEN) {
    return { statusCode: 500, headers: corsHeaders, body: JSON.stringify({ error: 'Token no configurado' }) };
  }

  try {
    const { items, pedido_codigo, cliente_email } = JSON.parse(event.body);

    const client = new MercadoPagoConfig({ accessToken: ACCESS_TOKEN });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: items.map(i => ({
          title: i.nombre,
          quantity: i.cantidad,
          unit_price: Number(i.precio_clp),
          currency_id: 'CLP',
        })),
        payer: { email: cliente_email },
        external_reference: pedido_codigo,
        back_urls: {
          success: 'https://mujercobra.cl/cart.html?pago=exitoso',
          failure: 'https://mujercobra.cl/cart.html?pago=fallido',
          pending: 'https://mujercobra.cl/cart.html?pago=pendiente',
        },
        auto_return: 'approved',
      }
    });

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ init_point: result.init_point }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
