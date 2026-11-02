const auth = require('../services/auth');

module.exports = async function requireAuth(req, res, next) {
  if (!req.cookies.auth_token) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.user = await auth.authenticate(req.cookies.auth_token);
    next();
  } catch (error) {
    next(error);
  }
};
