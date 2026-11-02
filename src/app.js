const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const path = require('node:path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// クエリ文字列・ヘッダー・本文はアクセスログに含めない。
app.use(morgan((tokens, req, res) => [
  tokens.method(req, res),
  req.originalUrl.split('?')[0],
  tokens.status(req, res),
  `${tokens['response-time'](req, res)} ms`,
].join(' ')));

app.use(require('./config/cors').createCorsMiddleware());

app.use(express.json({
  verify: (req, res, buffer) => {
    req.hasJsonBody = buffer.length > 0;
  },
}));

const fontAwesomeRoot = path.dirname(require.resolve('@fortawesome/fontawesome-free/package.json'));
app.use('/assets/fontawesome/css', express.static(path.join(fontAwesomeRoot, 'css')));
app.use('/assets/fontawesome/webfonts', express.static(path.join(fontAwesomeRoot, 'webfonts')));
app.use('/assets', express.static(path.join(__dirname, 'public')));
app.use('/', require('./routes/home'));
app.use(cookieParser());
app.use('/auth', require('./routes/auth'));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.post('/echo', (req, res) => {
  if (!req.is('application/json')) {
    return res.status(415).json({ error: 'Content-Type must be application/json' });
  }
  if (!req.hasJsonBody) {
    return res.status(400).json({ error: 'JSON body is required' });
  }
  res.json(req.body);
});

app.use((err, req, res, next) => {
  if (err.code === 'CORS_ORIGIN_DENIED') {
    return res.status(403).json({ error: 'Origin is not allowed' });
  }
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Invalid JSON body' });
  }
  next(err);
});

module.exports = app;
