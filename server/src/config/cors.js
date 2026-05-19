function getCorsOptions() {
  const raw = process.env.CORS_ORIGINS || process.env.CLIENT_URL || '';
  const origins = raw
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    return {
      origin: true,
      credentials: true,
    };
  }

  return {
    origin: origins,
    credentials: true,
  };
}

module.exports = { getCorsOptions };
