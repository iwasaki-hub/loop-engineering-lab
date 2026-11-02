const router = require('express').Router();
const { getPasswordPolicy } = require('../config/auth');

router.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.render('home', {
    passwordPolicy: getPasswordPolicy(),
    endpoints: [
      { method: 'GET', path: '/health', description: 'サーバーの応答を確認', auth: false },
      { method: 'POST', path: '/echo', description: '送ったJSONをそのまま受け取る', auth: false },
      { method: 'POST', path: '/auth/register', description: 'メール・パスワードと任意の名前で登録', auth: false },
      { method: 'GET', path: '/auth/password-policy', description: '登録パスワードの条件を取得', auth: false },
      { method: 'POST', path: '/auth/login', description: 'ログインして認証Cookieを取得', auth: false },
      { method: 'GET', path: '/auth/me', description: 'ログイン中のユーザーを取得', auth: true },
      { method: 'POST', path: '/auth/logout', description: 'すべてのログインを失効', auth: true },
    ],
  });
});

module.exports = router;
