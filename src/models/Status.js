// src/models/Status.js
const mongoose = require('mongoose');

const statusSchema = new mongoose.Schema({
  entityId: {
    type: String,
    required: true
  },
  entityType: {
    type: String,
    required: true,
    enum: ['user', 'order', 'payment', 'product', 'other']
  },
  status: {
    type: String,
    required: true
  },
  previousStatus: {
    type: String
  },
  metadata: {
    type: Object,
    default: {}
  },
  history: [{
    status: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    comment: String,
    changedBy: Number
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index yaratish
statusSchema.index({ entityId: 1, entityType: 1 }, { unique: true });

module.exports = mongoose.model('Status', statusSchema);
