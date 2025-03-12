// src/utils/helper.js
const Session = require('../models/Session');

module.exports = {
  setState: async (userId, state, data = {}) => {
    const session = await Session.findOneAndUpdate(
      { userId },
      { 
        state,
        data,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000)
      },
      { upsert: true, new: true }
    );
    return session;
  },
  
  getState: async (userId) => {
    const session = await Session.findOne({ userId });
    return session?.state || 'idle';
  },
  
  getSessionData: async (userId) => {
    const session = await Session.findOne({ userId });
    return session?.data || {};
  },
  
  clearState: async (userId) => {
    await Session.findOneAndUpdate(
      { userId },
      { state: 'idle', data: {} }
    );
  }
};
