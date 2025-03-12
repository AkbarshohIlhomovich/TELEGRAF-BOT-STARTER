const { Markup } = require("telegraf");
const { REQUIRED_CHANNELS } = require("../config/env");

/**
 * Middleware to check if the user is subscribed
 */
const checkSubscription = async (bot, ctx, next) => {
  if (!ctx || (!ctx.message && !ctx.callbackQuery)) return next();
  
  if (REQUIRED_CHANNELS.length === 0) {
    return next();
  }
  
  const telegram = ctx.tg || ctx.telegram || ctx.bot?.telegram;
  if (!telegram) {
    console.error("Telegram instance not found in context");
    return next();
  }

  const { allAdmin, nonAdminChannels } = await checkBotAdminStatus(bot);

  if (!allAdmin) {
    const buttons = nonAdminChannels.map(channel => [
      Markup.button.url(`${channel.name}`, channel.link),
    ]);
    
    await ctx.reply(
      "🚨 *Bot quyidagi kanallarda admin emas:*",
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard(buttons)
      }
    );
    return;
  }

  const userId = ctx.from?.id || (ctx.callbackQuery?.from?.id);
  if (!userId) {
    console.error("User ID not found in context");
    return next();
  }

  let notSubscribedChannels = [];

  for (const channel of REQUIRED_CHANNELS) {
    try {
      const chatMember = await telegram.getChatMember(channel.id, userId);
      if (!["member", "administrator", "creator"].includes(chatMember.status)) {
        notSubscribedChannels.push(channel);
      }
    } catch (error) {
      console.error(`❌ ${channel.name} kanalida a'zolikni tekshirishda xatolik:`, error.message);
      notSubscribedChannels.push(channel);
    }
  }

  if (notSubscribedChannels.length > 0) {
    const buttons = notSubscribedChannels.map(channel => [
      Markup.button.url(`${channel.name}`, channel.link),
    ]);
    
    if (ctx.callbackQuery) {
      await ctx.answerCbQuery();
    }

    await ctx.reply(
      "🚨 *Botdan foydalanish uchun quyidagi kanallarga a'zo bo'lishingiz kerak:*",
      {
        parse_mode: "Markdown",
        ...Markup.inlineKeyboard(buttons)
      }
    );
  } else {
    return next();
  }
};

/**
 * Function to check if the bot is an admin in required channels
 */
const checkBotAdminStatus = async (bot) => {
  try {
    const botInfo = await bot.telegram.getMe();
    const botId = botInfo.id;

    let allAdmin = true;
    let nonAdminChannels = [];

    for (const channel of REQUIRED_CHANNELS) {
      try {
        const chatMember = await bot.telegram.getChatMember(channel.id, botId);
        if (!["administrator", "creator"].includes(chatMember.status)) {
          console.error(`🚨 Bot ${channel.name} kanalida admin emas`);
          allAdmin = false;
          nonAdminChannels.push(channel);
        }
      } catch (error) {
        console.error(`❌ ${channel.name} kanalida bot admin statusini tekshirishda xatolik:`, error.message);
        allAdmin = false;
        nonAdminChannels.push(channel);
      }
    }

    return { allAdmin, nonAdminChannels };
  } catch (error) {
    console.error("Bot ma'lumotlarini olishda xatolik:", error.message);
    return { allAdmin: false, nonAdminChannels: REQUIRED_CHANNELS };
  }
};

module.exports = { checkBotAdminStatus, checkSubscription };
