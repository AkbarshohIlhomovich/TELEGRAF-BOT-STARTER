// src/middlewares/status.js
const StatusManager = require('../utils/statusManager');

/**
 * Status boshqaruv middleware
 */
module.exports = async (ctx, next) => {
  if (!ctx.from) return next();
  
  const userId = ctx.from.id.toString();

  // Context ga status boshqaruv metodlarini qo'shish
  ctx.userStatus = {
    // Foydalanuvchi statusini olish
    get: async () => await StatusManager.getStatus(userId, 'user'),
    
    // Foydalanuvchi statusini o'zgartirish
    set: async (status, metadata = {}, comment = '') => 
      await StatusManager.setStatus(userId, 'user', status, metadata, comment, userId),
    
    // Foydalanuvchi statusi ma'lumotlarini olish
    getDetails: async () => await StatusManager.getStatusDetails(userId, 'user'),
    
    // Status o'zgarishlari tarixini olish
    getHistory: async () => await StatusManager.getStatusHistory(userId, 'user'),
    
    // Status tekshirish
    isIn: async (statuses) => await StatusManager.isInStatus(userId, 'user', statuses),
    
    // Metadata ma'lumotlarini yangilash
    updateMetadata: async (metadata) => await StatusManager.updateMetadata(userId, 'user', metadata)
  };
  
  // Buyurtma statuslarini boshqarish uchun metod
  ctx.orderStatus = {
    get: async (orderId) => await StatusManager.getStatus(orderId, 'order'),
    set: async (orderId, status, metadata = {}, comment = '') => 
      await StatusManager.setStatus(orderId, 'order', status, metadata, comment, userId),
    getDetails: async (orderId) => await StatusManager.getStatusDetails(orderId, 'order'),
    getHistory: async (orderId) => await StatusManager.getStatusHistory(orderId, 'order'),
    isIn: async (orderId, statuses) => await StatusManager.isInStatus(orderId, 'order', statuses),
    updateMetadata: async (orderId, metadata) => 
      await StatusManager.updateMetadata(orderId, 'order', metadata)
  };
  
  // Boshqa obyektlar uchun universal status boshqaruvi
  ctx.status = {
    get: async (entityId, entityType) => await StatusManager.getStatus(entityId, entityType),
    set: async (entityId, entityType, status, metadata = {}, comment = '') => 
      await StatusManager.setStatus(entityId, entityType, status, metadata, comment, userId),
    getDetails: async (entityId, entityType) => await StatusManager.getStatusDetails(entityId, entityType),
    getHistory: async (entityId, entityType) => await StatusManager.getStatusHistory(entityId, entityType),
    isIn: async (entityId, entityType, statuses) => 
      await StatusManager.isInStatus(entityId, entityType, statuses),
    updateMetadata: async (entityId, entityType, metadata) => 
      await StatusManager.updateMetadata(entityId, entityType, metadata)
  };
  
  return next();
};