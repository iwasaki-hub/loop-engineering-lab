const User = require('../models/User');

module.exports = {
  create: (data) => User.create(data),
  findByEmail: (email) => User.findOne({ email }).select('+passwordHash +tokenVersion').exec(),
  findById: (id) => User.findById(id).select('+tokenVersion').exec(),
  revokeSessions: (id) => User.updateOne({ _id: id }, { $inc: { tokenVersion: 1 } }).exec(),
};
