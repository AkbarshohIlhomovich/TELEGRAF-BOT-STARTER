// src/models/Session.js
const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true
  },
  state: {
    type: String,
    default: 'idle'
  },
  data: {
    type: Object,
    default: {}
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
});

sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Session', sessionSchema);
