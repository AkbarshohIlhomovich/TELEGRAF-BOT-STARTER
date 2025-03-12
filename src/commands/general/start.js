// src/commands/general/start.js
const { mainMenu } = require('../../keyboards/main');
const User = require('../../models/User');
const { setState } = require('../../utils/helper');

module.exports = async (ctx) => {
  await setState(ctx.from.id, 'idle');
  
  const message = `Assalomu alaykum, ${ctx.from.first_name}!\n\nBotimizga xush kelibsiz. Buyurtma berish uchun quyidagi tugmalardan foydalaning.`;
  
  return ctx.reply(message, mainMenu);
};
