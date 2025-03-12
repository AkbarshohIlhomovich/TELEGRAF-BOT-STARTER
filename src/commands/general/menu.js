// src/commands/general/menu.js
const { mainMenu } = require('../../keyboards/main');

module.exports = async (ctx) => {
  return ctx.reply('Asosiy menyu:', mainMenu);
};
