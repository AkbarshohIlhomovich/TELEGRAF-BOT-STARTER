// src/handlers/callbackHandler.js
const User = require('../models/User');
const { adminMenu } = require('../keyboards/admin');

module.exports = async (ctx) => {
  const callbackData = ctx.callbackQuery.data;
  
  // Answer callback to remove loading state
  await ctx.answerCbQuery();
  
  // Handle admin callbacks
  if (callbackData === 'confirm_broadcast' && ctx.user.isAdmin) {
    // Yangi state middleware orqali sessionData olish
    const data = await ctx.state.getData();
    const message = data.message;
    
    if (!message) {
      return ctx.editMessageText('Xabar topilmadi.', adminMenu);
    }
    
    await ctx.editMessageText('Xabar yuborilmoqda...');
    
    // Get all users
    const users = await User.find();
    let sentCount = 0;
    let errorCount = 0;
    
    // Send message to all users
    for (const user of users) {
      try {
        await ctx.telegram.sendMessage(user.userId, message);
        sentCount++;
      } catch (error) {
        console.error(`Error sending message to ${user.userId}:`, error);
        errorCount++;
      }
      
      // Sleep to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    await ctx.state.clear();
    return ctx.reply(`Xabar yuborildi!\n\nYuborilgan: ${sentCount}\nXatolik: ${errorCount}`, adminMenu);
  }
  
  if (callbackData === 'cancel_broadcast' && ctx.user.isAdmin) {
    await ctx.state.clear();
    return ctx.editMessageText('Xabar yuborish bekor qilindi.', adminMenu);
  }
  
  if (callbackData === 'admin_back' && ctx.user.isAdmin) {
    return ctx.editMessageText('Admin boshqaruv paneli:', adminMenu);
  }
  
  // Buyurtma statusini o'zgartirish
  if (callbackData.startsWith('order_status_')) {
    if (!ctx.user.isAdmin) return;
    
    const [_, orderId, status] = callbackData.split('_');
    
    // Buyurtma statusini yangilash
    await ctx.orderStatus.set(orderId, status, {
      updatedAt: new Date(),
      updatedBy: ctx.from.id
    }, `Status ${status} ga o'zgartirildi`);
    
    return ctx.editMessageText(`Buyurtma #${orderId} statusi o'zgartirildi: ${status.toUpperCase()}`);
  }
  
  // User statusini o'zgartirish
  if (callbackData.startsWith('user_status_')) {
    if (!ctx.user.isAdmin) return;
    
    const [_, userId, status] = callbackData.split('_');
    
    // Foydalanuvchi statusini yangilash
    await ctx.status.set(userId, 'user', status, {
      updatedAt: new Date(),
      updatedBy: ctx.from.id
    }, `Status ${status} ga o'zgartirildi`);
    
    return ctx.editMessageText(`Foydalanuvchi #${userId} statusi o'zgartirildi: ${status.toUpperCase()}`);
  }
  
  // Handle other callbacks
  if (callbackData === 'back') {
    return ctx.editMessageText('Orqaga qaytildi.');
  }
};