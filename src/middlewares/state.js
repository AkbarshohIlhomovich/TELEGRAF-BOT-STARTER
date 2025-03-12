// src/middlewares/state.js
const StateManager = require('../utils/stateManager');

/**
 * Foydalanuvchi holatini boshqarish uchun middleware
 */
module.exports = async (ctx, next) => {
  if (!ctx.from) return next();
  
  const userId = ctx.from.id;

  // Context ga state boshqaruv metodlarini qo'shish
  ctx.state = {
    get: async () => await StateManager.getState(userId),
    set: async (state, data = {}) => await StateManager.setState(userId, state, data),
    update: async (state) => await StateManager.updateStateOnly(userId, state),
    clear: async () => await StateManager.clearState(userId),
    isIn: async (states) => await StateManager.isInState(userId, states),
    
    // Ma'lumotlar bilan ishlash
    getData: async () => await StateManager.getSessionData(userId),
    updateData: async (newData, merge = true) => await StateManager.updateSessionData(userId, newData, merge),
    getValue: async (key, defaultValue = null) => await StateManager.getDataValue(userId, key, defaultValue),
    setValue: async (key, value) => {
      const data = await StateManager.getSessionData(userId);
      data[key] = value;
      return StateManager.updateSessionData(userId, data);
    },
    
    // Qo'shimcha metodlar
    setStateAndValue: async (state, key, value) => await StateManager.setStateAndValue(userId, state, key, value),
    extend: async (expiresIn) => await StateManager.extendSession(userId, expiresIn)
  };
  
  return next();
};