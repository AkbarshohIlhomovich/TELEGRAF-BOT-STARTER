// src/utils/statusManager.js
const Status = require('../models/Status');

/**
 * Status boshqaruvi uchun utilita
 */
class StatusManager {
  /**
   * Status yaratish yoki yangilash
   * @param {string} entityId - Obyekt ID si (masalan, userId, orderId)
   * @param {string} entityType - Obyekt turi ('user', 'order', etc.)
   * @param {string} status - Yangi status
   * @param {Object} metadata - Qo'shimcha ma'lumotlar
   * @param {string} comment - Izoh
   * @param {number} changedBy - Kim tomonidan o'zgartirilgani (userId)
   */
  static async setStatus(entityId, entityType, status, metadata = {}, comment = '', changedBy = null) {
    const currentStatus = await Status.findOne({ entityId, entityType });
    
    if (!currentStatus) {
      // Yangi status yaratish
      const statusRecord = new Status({
        entityId,
        entityType,
        status,
        metadata,
        history: [{
          status,
          comment,
          changedBy
        }]
      });
      
      await statusRecord.save();
      return statusRecord;
    }
    
    // Status o'zgarmasa, o'zgartirish kerak emas
    if (currentStatus.status === status) {
      return currentStatus;
    }
    
    // Statusni yangilash
    currentStatus.previousStatus = currentStatus.status;
    currentStatus.status = status;
    
    // Metadatani yangilash
    if (metadata && Object.keys(metadata).length > 0) {
      currentStatus.metadata = { ...currentStatus.metadata, ...metadata };
    }
    
    // Tarixga qo'shish
    currentStatus.history.push({
      status,
      comment,
      changedBy,
      timestamp: new Date()
    });
    
    currentStatus.updatedAt = new Date();
    await currentStatus.save();
    
    return currentStatus;
  }
  
  /**
   * Status olish
   * @param {string} entityId - Obyekt ID si
   * @param {string} entityType - Obyekt turi
   */
  static async getStatus(entityId, entityType) {
    const statusRecord = await Status.findOne({ entityId, entityType });
    return statusRecord?.status || null;
  }
  
  /**
   * To'liq status ma'lumotlarini olish
   * @param {string} entityId - Obyekt ID si
   * @param {string} entityType - Obyekt turi
   */
  static async getStatusDetails(entityId, entityType) {
    return await Status.findOne({ entityId, entityType });
  }
  
  /**
   * Status o'zgarishlari tarixini olish
   * @param {string} entityId - Obyekt ID si
   * @param {string} entityType - Obyekt turi
   */
  static async getStatusHistory(entityId, entityType) {
    const statusRecord = await Status.findOne({ entityId, entityType });
    return statusRecord?.history || [];
  }
  
  /**
   * Status ma'lumotlarini yangilash
   * @param {string} entityId - Obyekt ID si
   * @param {string} entityType - Obyekt turi
   * @param {Object} metadata - Qo'shimcha ma'lumotlar
   */
  static async updateMetadata(entityId, entityType, metadata) {
    const statusRecord = await Status.findOne({ entityId, entityType });
    
    if (!statusRecord) {
      return null;
    }
    
    statusRecord.metadata = { ...statusRecord.metadata, ...metadata };
    statusRecord.updatedAt = new Date();
    await statusRecord.save();
    
    return statusRecord;
  }
  
  /**
   * Status tekshirish
   * @param {string} entityId - Obyekt ID si
   * @param {string} entityType - Obyekt turi
   * @param {string|string[]} statuses - Tekshiriladigan status(lar)
   */
  static async isInStatus(entityId, entityType, statuses) {
    const currentStatus = await this.getStatus(entityId, entityType);
    
    if (!currentStatus) {
      return false;
    }
    
    if (Array.isArray(statuses)) {
      return statuses.includes(currentStatus);
    }
    
    return currentStatus === statuses;
  }
}

module.exports = StatusManager;
