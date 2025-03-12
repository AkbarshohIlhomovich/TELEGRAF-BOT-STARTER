// src/keyboards/admin.js
const { Markup } = require('telegraf');

module.exports = {
  adminMenu: Markup.keyboard([
    ['👥 Foydalanuvchilar', '📊 Statistika'],
    ['📢 Xabar yuborish', '⚙️ Sozlamalar'],
    ['🏠 Asosiy menyu']
  ]).resize(),
  
  userManagement: Markup.inlineKeyboard([
    [
      Markup.button.callback('🚫 Bloklash', 'user_block'),
      Markup.button.callback('✅ Blokdan chiqarish', 'user_unblock')
    ],
    [Markup.button.callback('◀️ Orqaga', 'admin_back')]
  ]),
  
  broadcastOptions: Markup.inlineKeyboard([
    [
      Markup.button.callback('✅ Tasdiqlash', 'confirm_broadcast'),
      Markup.button.callback('❌ Bekor qilish', 'cancel_broadcast')
    ]
  ])
};
