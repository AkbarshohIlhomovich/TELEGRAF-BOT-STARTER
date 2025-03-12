// src/commands/admin/stats.js
const User = require('../../models/User');

module.exports = async (ctx) => {
  if (!ctx.user.isAdmin) {
    return ctx.reply('Bu buyruq faqat adminlar uchun.');
  }
  
  const totalUsers = await User.countDocuments();
  const todayUsers = await User.countDocuments({
    createdAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
  });
  const activeUsers = await User.countDocuments({
    lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
  });
  
  const message = `📊 Statistika:

👥 Jami foydalanuvchilar: ${totalUsers}
🆕 Bugun qo'shilganlar: ${todayUsers}
✅ Faol foydalanuvchilar (24 soat): ${activeUsers}`;

  return ctx.reply(message);
};
