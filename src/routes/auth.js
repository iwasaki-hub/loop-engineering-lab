const express = require('express');
const auth = require('../services/auth');
const users = require('../repositories/users');
const requireAuth = require('../middleware/auth');
const rateLimit = require('../middleware/authRateLimit');
const { cookieOptions, getPasswordPolicy } = require('../config/auth');
const router = express.Router();

router.use((req, res, next) => {
  res.set('Cache-Control', 'no-store');
  if (req.method === 'POST') {
    if (req.get('X-Requested-With') !== 'XMLHttpRequest') {
      return res.status(403).json({ error: 'X-Requested-With header is required' });
    }
    if (!req.is('application/json')) return res.status(415).json({ error: 'Content-Type must be application/json' });
  }
  next();
});

router.get('/password-policy', (req, res) => {
  res.json(getPasswordPolicy());
});

router.post('/register', rateLimit, async (req, res) => {
  res.status(201).json({ user: await auth.register(req.body) });
});

router.post('/login', rateLimit, async (req, res) => {
  const { user, token } = await auth.login(req.body);
  res.cookie('auth_token', token, { ...cookieOptions(), maxAge: 60 * 60 * 1000 });
  res.json({ user });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: auth.publicUser(req.user) });
});

router.post('/logout', requireAuth, async (req, res) => {
  await users.revokeSessions(req.user._id);
  res.clearCookie('auth_token', cookieOptions());
  res.sendStatus(204);
});

router.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = [400, 401, 409].includes(err.status) ? err.status : 500;
  res.status(status).json({ error: status === 500 ? 'Internal server error' : err.message });
});

module.exports = router;
