exports.handler = async (event) => {
  // Solo aceptar POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // Verificar origen — solo permitir mujercobra.cl y localhost (desarrollo)
  const origin = event.headers['origin'] || event.headers['Origin'] || '';
  const allowedOrigins = [
    'https://mujercobra.cl',
    'https://www.mujercobra.cl',
    'http://localhost:8888',   // Netlify Dev local
    'http://localhost:3000',
    'http://127.0.0.1:5500',  // Live Server VS Code
  ];
  const corsOrigin = allowedOrigins.includes(origin) ? origin : 'https://mujercobra.cl';

  const corsHeaders = {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };

  // Preflight OPTIONS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  const SUPABASE_URL = 'https://mvtdzqjtbmgvhdoouhjw.supabase.co';
  const SERVICE_KEY  = process.env.SUPABASE_SERVICE_KEY;

  if (!SERVICE_KEY) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Variable de entorno no configurada' }),
    };
  }

  try {
    const { fileName, fileBase64, fileType } = JSON.parse(event.body);

    if (!fileName || !fileBase64 || !fileType) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Faltan datos: fileName, fileBase64, fileType' }),
      };
    }

    // Validar tipo de archivo — solo imágenes
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(fileType)) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Tipo de archivo no permitido. Solo imágenes.' }),
      };
    }

    // Validar tamaño — máximo 5MB en base64 (~6.8MB en base64)
    if (fileBase64.length > 7000000) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Archivo demasiado grande. Máximo 5MB.' }),
      };
    }

    const buffer = Buffer.from(fileBase64, 'base64');

    const res = await fetch(
      `${SUPABASE_URL}/storage/v1/object/Productos/${fileName}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SERVICE_KEY}`,
          'apikey': SERVICE_KEY,
          'Content-Type': fileType,
          'x-upsert': 'true',
        },
        body: buffer,
      }
    );

    if (!res.ok) {
      const err = await res.text();
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: err }),
      };
    }

    const publicUrl = `${SUPABASE_URL}/storage/v1/object/public/Productos/${fileName}`;
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ url: publicUrl }),
    };

  } catch (err) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
