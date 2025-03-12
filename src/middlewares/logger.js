// src/middlewares/logger.js
module.exports = async (ctx, next) => {
    const start = new Date();
    
    const logInfo = {
      userId: ctx.from?.id,
      username: ctx.from?.username,
      chatId: ctx.chat?.id,
      chatType: ctx.chat?.type,
      messageText: ctx.message?.text,
      updateType: ctx.updateType
    };
    
    console.log(`[${start.toISOString()}] Received update: ${JSON.stringify(logInfo)}`);
    
    await next();
    
    const ms = new Date() - start;
    console.log(`[${new Date().toISOString()}] Response time: ${ms}ms`);
  };
  