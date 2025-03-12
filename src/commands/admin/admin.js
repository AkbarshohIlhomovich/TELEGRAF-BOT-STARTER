// src/commands/admin/admin.js
const { adminMenu } = require('../../keyboards/admin');

module.exports = async (ctx) => {
  if (!ctx.user.isAdmin) {
    return ctx.reply('Bu buyruq faqat adminlar uchun.');
  }
  
  return ctx.reply('Admin boshqaruv paneli:', adminMenu);
};
