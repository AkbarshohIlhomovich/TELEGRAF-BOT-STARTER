// src/middlewares/auth.js
const User = require('../models/User');
const { ADMIN_IDS } = require('../config/env');

module.exports = async (ctx, next) => {
  if (!ctx.from) return next();

  const userId = ctx.from.id;
  
  try {
    let user = await User.findOne({ userId });
    
    if (!user) {
      user = new User({
        userId,
        username: ctx.from.username,
        firstName: ctx.from.first_name,
        lastName: ctx.from.last_name,
        isAdmin: ADMIN_IDS.includes(userId.toString())
      });
      await user.save();
    } else {
      // Update user data if necessary
      user.lastActive = new Date();
      user.username = ctx.from.username || user.username;
      user.firstName = ctx.from.first_name || user.firstName;
      user.lastName = ctx.from.last_name || user.lastName;
      await user.save();
    }

    ctx.user = user;
    return next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    return next();
  }
};
