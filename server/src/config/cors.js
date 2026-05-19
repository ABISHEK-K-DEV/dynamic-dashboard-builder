function parseOrigins() {
  const raw = process.env.CORS_ORIGINS || process.env.CLIENT_URL || '';
  return raw
    .split(',')
    .map((o) => o.trim().replace(/\/$/, ''))
    .filter(Boolean);
}

function isVercelPreview(origin) {
  return /^https:\/\/[\w.-]+\.vercel\.app$/.test(origin);
}

function getCorsOptions() {
  const allowedOrigins = parseOrigins();
  const allowVercelPreviews = process.env.CORS_ALLOW_VERCEL === 'true';

  if (allowedOrigins.length === 0) {
    console.log('CORS: allowing all origins (CORS_ORIGINS not set)');
    return {
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    };
  }

  console.log('CORS allowed origins:', allowedOrigins.join(', '));
  if (allowVercelPreviews) {
    console.log('CORS: also allowing *.vercel.app preview URLs');
  }

  return {
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      if (allowVercelPreviews && isVercelPreview(origin)) {
        return callback(null, true);
      }

      console.warn(`CORS blocked request from: ${origin}`);
      return callback(null, false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };
}

module.exports = { getCorsOptions, parseOrigins };
