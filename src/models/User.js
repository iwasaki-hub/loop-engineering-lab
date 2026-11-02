const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, trim: true, maxlength: 100, default: '' },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true, maxlength: 254 },
  passwordHash: { type: String, required: true, select: false },
  tokenVersion: { type: Number, default: 0, required: true, select: false },
}, { timestamps: true });

module.exports = mongoose.model('User', schema);
