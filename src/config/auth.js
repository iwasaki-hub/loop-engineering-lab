function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (typeof secret !== 'string' || Buffer.byteLength(secret) < 32) {
    throw new Error('JWT_SECRET must contain at least 32 bytes');
  }
  return secret;
}

function cookieOptions() {
  return { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict', path: '/auth' };
}

function getPasswordPolicy() {
  const raw = process.env.PASSWORD_MIN_LENGTH ?? '4';
  if (!/^[1-9]\d*$/.test(raw) || Number(raw) > 72) {
    throw new Error('PASSWORD_MIN_LENGTH must be an integer between 1 and 72');
  }
  return { minLength: Number(raw), maxBytes: 72 };
}

module.exports = { getSecret, cookieOptions, getPasswordPolicy };
