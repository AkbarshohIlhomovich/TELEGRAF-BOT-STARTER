// src/utils/stateManager.js
const Session = require('../models/Session');

/**
 * Foydalanuvchi holatlarini boshqarish uchun kengaytirilgan utilita
 */
class StateManager {
  /**
   * Foydalanuvchi holatini yangilash
   * @param {number} userId - Foydalanuvchi ID raqami
   * @param {string} state - Yangi holat
   * @param {Object} data - Saqlash kerak bo'lgan ma'lumotlar
   * @param {number} expiresIn - Muddati (millisekund), standart: 24 soat
   */
  static async setState(userId, state, data = {}, expiresIn = 24 * 60 * 60 * 1000) {
    const session = await Session.findOneAndUpdate(
      { userId },
      { 
        state,
        data,
        expiresAt: new Date(Date.now() + expiresIn)
      },
      { upsert: true, new: true }
    );
    return session;
  }
  
  /**
   * Foydalanuvchi joriy holatini olish
   * @param {number} userId - Foydalanuvchi ID raqami
   * @returns {string} Joriy holat
   */
  static async getState(userId) {
    const session = await Session.findOne({ userId });
    return session?.state || 'idle';
  }
  
  /**
   * Ma'lum bir holatda ekanligini tekshirish
   * @param {number} userId - Foydalanuvchi ID raqami
   * @param {string|string[]} states - Tekshirish kerak bo'lgan holat(lar)
   * @returns {boolean} Holat mos kelsa true, aks holda false
   */
  static async isInState(userId, states) {
    const currentState = await this.getState(userId);
    
    if (Array.isArray(states)) {
      return states.includes(currentState);
    }
    
    return currentState === states;
  }
  
  /**
   * Foydalanuvchi ma'lumotlarini olish
   * @param {number} userId - Foydalanuvchi ID raqami
   * @returns {Object} Saqlangan ma'lumotlar
   */
  static async getSessionData(userId) {
    const session = await Session.findOne({ userId });
    return session?.data || {};
  }
  
  /**
   * Ma'lumotlarni yangilamay holatni yangilash
   * @param {number} userId - Foydalanuvchi ID raqami
   * @param {string} state - Yangi holat
   */
  static async updateStateOnly(userId, state) {
    const session = await Session.findOne({ userId });
    
    if (session) {
      session.state = state;
      await session.save();
      return session;
    }
    
    return this.setState(userId, state);
  }
  
  /**
   * Foydalanuvchi ma'lumotlarini yangilash
   * @param {number} userId - Foydalanuvchi ID raqami
   * @param {Object} newData - Yangi ma'lumotlar
   * @param {boolean} merge - Mavjud ma'lumotlarni saqlab qolish (true) yoki to'liq almashtirish (false)
   */
  static async updateSessionData(userId, newData, merge = true) {
    const session = await Session.findOne({ userId });
    
    if (!session) {
      return this.setState(userId, 'idle', newData);
    }
    
    if (merge) {
      session.data = { ...session.data, ...newData };
    } else {
      session.data = newData;
    }
    
    await session.save();
    return session;
  }
  
  /**
   * Foydalanuvchi holatini tozalash
   * @param {number} userId - Foydalanuvchi ID raqami
   */
  static async clearState(userId) {
    await Session.findOneAndUpdate(
      { userId },
      { state: 'idle', data: {} }
    );
  }
  
  /**
   * Holatdagi ma'lumot qiymatini olish
   * @param {number} userId - Foydalanuvchi ID raqami
   * @param {string} key - Kalit
   * @param {*} defaultValue - Standart qiymat
   */
  static async getDataValue(userId, key, defaultValue = null) {
    const data = await this.getSessionData(userId);
    return data[key] !== undefined ? data[key] : defaultValue;
  }
  
  /**
   * Foydalanuvchi holatini va ma'lum bir ma'lumotni yangilash
   * @param {number} userId - Foydalanuvchi ID raqami
   * @param {string} state - Yangi holat
   * @param {string} key - Kalit
   * @param {*} value - Qiymat
   */
  static async setStateAndValue(userId, state, key, value) {
    const data = await this.getSessionData(userId);
    data[key] = value;
    return this.setState(userId, state, data);
  }
  
  /**
   * Holat va ma'lumotlar vaqtini uzaytirish
   * @param {number} userId - Foydalanuvchi ID raqami
   * @param {number} expiresIn - Muddati (millisekund)
   */
  static async extendSession(userId, expiresIn = 24 * 60 * 60 * 1000) {
    const session = await Session.findOne({ userId });
    
    if (session) {
      session.expiresAt = new Date(Date.now() + expiresIn);
      await session.save();
      return session;
    }
    
    return null;
  }
}

module.exports = StateManager;
