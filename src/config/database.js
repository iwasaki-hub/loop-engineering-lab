const mongoose = require('mongoose');

async function connectDatabase(uri) {
  if (typeof uri !== 'string' || !uri.trim()) {
    throw new Error('MONGO_URI is required');
  }
  return mongoose.connect(uri);
}

module.exports = connectDatabase;
