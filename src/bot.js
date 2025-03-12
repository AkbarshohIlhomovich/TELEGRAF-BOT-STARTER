const { Telegraf, session } = require('telegraf');
const mongoose = require('mongoose');
const { BOT_TOKEN, MONGODB_URI } = require('./config/env');
const fs = require('fs');
const path = require('path');

// Middlewares
const authMiddleware = require('./middlewares/auth');
const loggerMiddleware = require('./middlewares/logger');
const stateMiddleware = require('./middlewares/state');
const statusMiddleware = require('./middlewares/status');
const {checkSubscription, checkBotAdminStatus} = require('./middlewares/subscription');

// Initialize bot
const bot = new Telegraf(BOT_TOKEN);

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middlewares
bot.use(session());
bot.use(async (ctx, next) => {
  await checkSubscription(bot, ctx, next);
});
bot.use(authMiddleware);
bot.use(loggerMiddleware);
bot.use(stateMiddleware);
bot.use(statusMiddleware);

// Automatically import all command handlers
const commandsPath = path.join(__dirname, 'commands');
const registerCommands = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      registerCommands(fullPath);
    } else if (file.endsWith('.js')) {
      const commandName = path.basename(file, '.js');
      const commandHandler = require(fullPath);
      bot.command(commandName, commandHandler);
    }
  });
};

registerCommands(commandsPath);

// Automatically import all hears handlers
const hearsPath = path.join(__dirname, 'hears');
if (fs.existsSync(hearsPath)) {
  fs.readdirSync(hearsPath).forEach(file => {
    if (file.endsWith('.js')) {
      const hearsHandler = require(path.join(hearsPath, file));
      if (typeof hearsHandler.pattern !== 'undefined' && typeof hearsHandler.handler === 'function') {
        bot.hears(hearsHandler.pattern, hearsHandler.handler);
      }
    }
  });
}

// Automatically import all message handlers
const handlersPath = path.join(__dirname, 'handlers');
fs.readdirSync(handlersPath).forEach(file => {
  if (file.endsWith('.js')) {
    const handler = require(path.join(handlersPath, file));
    if (file.startsWith('text')) bot.on('text', handler);
    if (file.startsWith('callback')) bot.on('callback_query', handler);
    if (file.startsWith('contact')) bot.on('contact', handler);
  }
});

// Handle errors
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply('Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.').catch(() => {});
});

module.exports = bot;
