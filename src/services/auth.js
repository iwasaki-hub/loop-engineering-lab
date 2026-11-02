const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const users = require('../repositories/users');
const { getSecret, getPasswordPolicy } = require('../config/auth');

function httpError(status, message) {
  return Object.assign(new Error(message), { status });
}

function credentials(body, registration = false) {
  if (!body || typeof body.email !== 'string' || typeof body.password !== 'string') {
    throw httpError(400, 'Email and password are required');
  }
  const email = body.email.trim().toLowerCase();
  const { minLength, maxBytes } = getPasswordPolicy();
  const requiredLength = registration ? minLength : 1;
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      Array.from(body.password).length < requiredLength || Buffer.byteLength(body.password, 'utf8') > maxBytes) {
    throw httpError(400, `Invalid email or password (${requiredLength} characters minimum, ${maxBytes} UTF-8 bytes maximum)`);
  }
  return { email, password: body.password };
}

function publicUser(user) {
  return { id: String(user._id), name: user.name ?? '', email: user.email };
}

async function register(body) {
  const { email, password } = credentials(body, true);
  if (body.name !== undefined && (typeof body.name !== 'string' || body.name.trim().length > 100)) {
    throw httpError(400, 'Name must be a string of at most 100 characters');
  }
  const name = body.name === undefined ? '' : body.name.trim();
  const passwordHash = await bcrypt.hash(password, 12);
  try {
    return publicUser(await users.create({ name, email, passwordHash }));
  } catch (error) {
    if (error.code === 11000) throw httpError(409, 'Email is already registered');
    throw error;
  }
}

// 存在しないユーザーでも比較処理を行い、存在の推測を難しくする。
const dummyHash = bcrypt.hash('dummy-password-not-a-user', 12);

async function login(body) {
  const { email, password } = credentials(body);
  const secret = getSecret();
  const user = await users.findByEmail(email);
  const matches = await bcrypt.compare(password, user ? user.passwordHash : await dummyHash);
  if (!user || !matches) throw httpError(401, 'Invalid email or password');
  const token = jwt.sign({ ver: user.tokenVersion }, secret, {
    algorithm: 'HS256', subject: String(user._id), expiresIn: '1h',
    issuer: 'loop-engineering-lab', audience: 'loop-auth',
  });
  return { user: publicUser(user), token };
}

async function authenticate(token) {
  const secret = getSecret();
  let claims;
  try {
    claims = jwt.verify(token, secret, {
      algorithms: ['HS256'], issuer: 'loop-engineering-lab', audience: 'loop-auth',
    });
  } catch {
    throw httpError(401, 'Authentication required');
  }
  if (typeof claims.sub !== 'string' || !Number.isInteger(claims.ver)) {
    throw httpError(401, 'Authentication required');
  }
  let user;
  try {
    user = await users.findById(claims.sub);
  } catch (error) {
    if (error.name === 'CastError') throw httpError(401, 'Authentication required');
    throw error;
  }
  if (!user || user.tokenVersion !== claims.ver) throw httpError(401, 'Authentication required');
  return user;
}

module.exports = { register, login, authenticate, publicUser };
