// src/keyboards/main.js
const { Markup } = require('telegraf');

module.exports = {
  mainMenu: Markup.keyboard([
    ['📋 Buyurtma berish', '🛒 Savatcha'],
    ['ℹ️ Ma\'lumot', '☎️ Aloqa']
  ]).resize(),
  
  contactRequest: Markup.keyboard([
    [Markup.button.contactRequest('📱 Telefon raqamni yuborish')]
  ]).resize(),
  
  removeKeyboard: Markup.removeKeyboard(),
  
  inlineBackButton: Markup.inlineKeyboard([
    Markup.button.callback('◀️ Orqaga', 'back')
  ])
};
