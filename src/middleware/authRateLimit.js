// 開発用・単一プロセスの制限。複数インスタンスでは共有ストアに置き換える。
const buckets = new Map();
const windowMs = 15 * 60 * 1000;

module.exports = function authRateLimit(req, res, next) {
  const now = Date.now();
  for (const [key, value] of buckets) {
    if (value.until <= now) buckets.delete(key);
  }
  let bucket = buckets.get(req.ip);
  if (!bucket) {
    if (buckets.size >= 10000) return res.status(429).json({ error: 'Too many requests' });
    bucket = { count: 0, until: now + windowMs };
    buckets.set(req.ip, bucket);
  }
  if (++bucket.count > 30) {
    res.set('Retry-After', String(Math.ceil((bucket.until - now) / 1000)));
    return res.status(429).json({ error: 'Too many requests' });
  }
  next();
};
