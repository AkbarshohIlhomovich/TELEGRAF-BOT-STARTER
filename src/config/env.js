require('dotenv').config();

module.exports = {
  BOT_TOKEN: process.env.BOT_TOKEN,
  MONGODB_URI: process.env.MONGODB_URI,
  ADMIN_IDS: process.env.ADMIN_IDS ? process.env.ADMIN_IDS.split(',') : [],
  NODE_ENV: process.env.NODE_ENV || 'development',
  REQUIRED_CHANNELS: [
    {
        id: "-1001968599947",
        name: "👨🏻‍💻The Dev Diary | أكبر",
        link: "https://t.me/+dXPMBHYsiulhMGUy"
    },
    {
        id: "-1001848854184",
        name: "Namoz Vaqtlari | Намоз вактлари | Pray Time",
        link: "https://t.me/+UqKUKWZ4WNFiODIy"
    }
],
};
