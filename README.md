# 🤖 Telegraf Bot – Katta Imkoniyatli Telegram Bot

**Telegraf Bot** – bu `Telegraf.js` asosida yaratilgan kuchli va zamonaviy **Telegram bot** bo‘lib,  
*foydalanuvchi kanallarga obuna bo‘lganligini tekshirish*, *inline tugmalar orqali yo‘naltirish*  
hamda *admin boshqaruv paneli* kabi xususiyatlarga ega. 💡  

---

## 🚀 Asosiy Imkoniyatlar

✅ **Kanal obuna tekshiruvi** – Foydalanuvchi botdan foydalanishdan oldin kerakli kanallarga obuna bo‘lganligini tekshiradi.  
✅ **Botning admin huquqlarini tekshirish** – Agar bot kanalga admin qilib qo‘yilmagan bo‘lsa, u avtomatik ravishda chiqib ketadi.  
✅ **Inline tugmalar** – Foydalanuvchilar obuna bo‘lishlari uchun qulay tugmalar yuboriladi.  
✅ **Admin boshqaruvi** – Adminlar uchun maxsus buyruqlarni qo‘llab-quvvatlaydi.  
✅ **MongoDB bilan ishlash** – Foydalanuvchi ma’lumotlarini saqlash uchun **MongoDB** integratsiyasi mavjud.  
✅ **Tez va engil** – Telegraf botining eng yangi versiyasidan foydalanadi.  

---

## 🛠 O‘rnatish

### 1️⃣ **Loyihani yuklab oling**
```bash
git clone https://github.com/your-username/telegraf-bot.git
cd telegraf-bot
2️⃣ Kerakli modullarni o‘rnatish
Node.js (v16+) o‘rnatilganligiga ishonch hosil qiling, so‘ng quyidagi buyruqni bajaring:

npm install
3️⃣ Muhit sozlamalarini o‘rnating
Loyihangizning telegraf-bot papkasida .env faylini yarating:

touch .env
Faylni tahrirlab quyidagi ma’lumotlarni qo‘shing:

BOT_TOKEN=YOUR_TELEGRAM_BOT_TOKEN
MONGODB_URI=mongodb://localhost:27017/telegraf-bot
ADMIN_IDS=12345678,1483562392
NODE_ENV=development
REQUIRED_CHANNELS=@your_channel_1,@your_channel_2
📌 Diqqat! BOT_TOKEN o‘rniga o‘z bot tokeningizni kiriting, MONGODB_URI esa MongoDB ulanish manzili.

⚙️ Ishga tushirish
Loyihani ishga tushirish uchun quyidagi buyruqni bajaring:

node src/index.js
✅ Agar bot ishlay boshlasa, foydalanuvchi kerakli kanallarga obuna bo‘lganini tekshiradi va inline tugmalar orqali yo‘naltiradi.

📂 Loyihaning Tuzilishi
/telegraf-bot
├── src/
│   ├── commands/       # Buyruqlar
│   │   ├── general/    # Oddiy foydalanuvchi buyruqlari
│   │   ├── admin/      # Admin buyruqlari
│   ├── handlers/       # Hears, events, message handlerlar
│   ├── middlewares/    # Middleware'lar
│   │   ├── checkSubscription.js  # Obuna tekshirish
│   ├── models/         # MongoDB modellar
│   ├── keyboards/      # Inline va reply tugmalar
│   ├── utils/          # Helper funksiyalar
│   ├── config/         # Konfiguratsiya fayllari
│   ├── bot.js          # Asosiy bot konfiguratsiyasi
│   ├── index.js        # Botni ishga tushirish
├── .env                # Muhim sozlamalar
├── package.json        # Node.js bog‘liqliklari
├── README.md           # Dokumentatsiya
🔧 Middleware: checkSubscription.js
Bu middleware:

✅ Bot admin ekanligini tekshiradi.
✅ Foydalanuvchi obuna bo‘lganligini aniqlaydi.
✅ Inline tugmalar yuboradi agar foydalanuvchi obuna bo‘lmagan bo‘lsa.
📌 Foydalanish usuli:


bot.use(require("./middlewares/checkSubscription"));
❗ Muammolar va Yechimlar
1️⃣ Bot darhol chiqib ketmoqda
Sabab: Bot kerakli kanallarga admin qilib qo‘yilmagan.
✔ Yechim: Botni barcha kanallarga admin qiling va qayta ishga tushiring.

2️⃣ Foydalanuvchi obuna bo‘lgan bo‘lsa ham, xatolik chiqyapti
Sabab: Telegramda ba’zi foydalanuvchilar obunani yashirgan bo‘lishi mumkin.
✔ Yechim: Foydalanuvchilarga Telegram sozlamalarida obunani ochiq qilishni ayting.

3️⃣ Bot buyruqlarga javob bermayapti
Sabab: Token noto‘g‘ri yoki kerakli modullar o‘rnatilmagan.
✔ Yechim: .env faylini tekshiring va quyidagi buyruq bilan modullarni yangilang:

npm install
🌍 Hissa Qo‘shish
Agar siz botni yaxshilashni xohlasangiz, repository’ni fork qiling, o‘zgartirish kiriting va pull request yuboring! 🎉

📜 Litsenziya
Bu loyiha MIT litsenziyasi asosida ochiq manba sifatida tarqatiladi.

💡 Qo‘shimcha Savollar?
📬 Telegram: Dasturchi bilan bog‘lanish
🌐 GitHub Issues: Xatolik yoki taklif bildirish

---

### 🚀 **Tayyor!**
1. **Faylni** `README.md` sifatida **saqlang**.
2. **GitHub’ga yuklang**:
   ```bash
   git add README.md
   git commit -m "Zo‘r dokumentatsiya qo‘shildi!"
   git push origin main