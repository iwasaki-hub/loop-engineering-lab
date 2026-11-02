const cors = require('cors');

function getClientOrigins() {
  const origins = (process.env.CLIENT_ORIGINS ?? 'http://localhost:5173,http://127.0.0.1:5173')
    .split(',').map((value) => value.trim());
  for (const origin of origins) {
    let url;
    try { url = new URL(origin); } catch { throw new Error('CLIENT_ORIGINS must contain HTTP(S) origins'); }
    if (!['http:', 'https:'].includes(url.protocol) || url.origin !== origin) {
      throw new Error('CLIENT_ORIGINS must contain HTTP(S) origins without paths or wildcards');
    }
  }
  return [...new Set(origins)];
}

function createCorsMiddleware() {
  const allowed = new Set(getClientOrigins());
  const middleware = cors({
    origin(origin, callback) {
      if (allowed.has(origin)) return callback(null, true);
      callback(Object.assign(new Error('Origin is not allowed'), { code: 'CORS_ORIGIN_DENIED' }));
    },
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'X-Requested-With'],
    optionsSuccessStatus: 204,
  });
  return (req, res, next) => {
    res.vary('Origin');
    const origin = req.get('Origin');
    // EJSの同一オリジン通信とPostmanなどのOriginなし通信も維持する。
    if (!origin || origin === `${req.protocol}://${req.get('host')}`) return next();
    middleware(req, res, next);
  };
}

module.exports = { getClientOrigins, createCorsMiddleware };
