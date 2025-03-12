// src/handlers/textHandler.js
const { mainMenu } = require('../keyboards/main');
const { adminMenu } = require('../keyboards/admin');

module.exports = async (ctx) => {
  const text = ctx.message.text;
  
  // State ni olish va tekshirish - yangi middlewaredan foydalanish
  const state = await ctx.state.get();
  
  // Handle state-based conversations
  if (state !== 'idle') {
    // Get session data
    const data = await ctx.state.getData();
    
    // Handle broadcast message state for admins
    if (state === 'awaiting_broadcast_message' && ctx.user.isAdmin) {
      await ctx.state.setStateAndValue('confirm_broadcast', 'message', text);
      
      return ctx.reply('Xabar yuborilsinmi?', {
        reply_markup: {
          inline_keyboard: [
            [
              { text: '✅ Ha', callback_data: 'confirm_broadcast' },
              { text: '❌ Yo\'q', callback_data: 'cancel_broadcast' }
            ]
          ]
        }
      });
    }
    
    // Boshqa holatlarni tekshirish...
    if (await ctx.state.isIn(['register_name', 'register_phone', 'register_address'])) {
      // Ro'yxatdan o'tkazish jarayoni...
      const currentStep = state.replace('register_', '');
      
      switch(currentStep) {
        case 'name':
          await ctx.state.setStateAndValue('register_phone', 'name', text);
          return ctx.reply('Iltimos, telefon raqamingizni kiriting:', {
            reply_markup: {
              keyboard: [
                [{ text: '📱 Raqamni yuborish', request_contact: true }],
                ['❌ Bekor qilish']
              ],
              resize_keyboard: true
            }
          });

        case 'phone':
          let phoneNumber;
          
          // Check if the message is a shared contact
          console.log('ctx.message')
          if (ctx.message.contact) {
            phoneNumber = ctx.message.contact.phone_number;
          } else {
            // If not a shared contact, validate the manually entered phone number
            const phoneRegex = /^(\+998|998)?[0-9]{9}$/;
            if (!phoneRegex.test(text.replace(/\s/g, ''))) {
              return ctx.reply('Noto\'g\'ri telefon raqam formati. Iltimos, qaytadan kiriting yoki "📱 Raqamni yuborish" tugmasini bosing:');
            }
            phoneNumber = text;
          }
          
          // Ensure the phone number starts with +998
          if (!phoneNumber.startsWith('+998')) {
            phoneNumber = '+998' + phoneNumber.replace(/^998/, '');
          }
          
          await ctx.state.setStateAndValue('register_address', 'phone', phoneNumber);
          return ctx.reply('Iltimos, manzilingizni kiriting:', {
            reply_markup: {
              remove_keyboard: true
            }
          });  
        
        case 'address':
          // Ro'yxatdan o'tkazishni yakunlash
          await ctx.state.setStateAndValue('idle', 'address', text);
          const userData = await ctx.state.getData();
          
          // Foydalanuvchi statusini o'zgartirish
          await ctx.userStatus.set('active', {
            registrationComplete: true,
            registrationDate: new Date()
          }, 'Ro\'yxatdan o\'tish jarayoni tugallandi');
          
          return ctx.reply(`Ro'yxatdan o'tish muvaffaqiyatli yakunlandi.\n\nIsm: ${userData.name}\nTelefon: ${userData.phone}\nManzil: ${userData.address}`, mainMenu);
      }
    }
    
    return;
  }
  
  // Handle main menu options
  switch (text) {
    case '📋 Buyurtma berish':
      // Avval foydalanuvchi statusini tekshirish
      if (!await ctx.userStatus.isIn(['active', 'premium'])) {
        await ctx.state.set('register_name');
        return ctx.reply('Buyurtma berish uchun ro\'yxatdan o\'tish kerak. Iltimos, ismingizni kiriting:', {
          reply_markup: {
            keyboard: [['❌ Bekor qilish']],
            resize_keyboard: true
          }
        });
      }
      
      return ctx.reply('Buyurtma berish uchun quyidagi kategoriyalardan birini tanlang:', {
        reply_markup: {
          keyboard: [
            ['🍕 Pitsa', '🍔 Burger', '🍲 Milliy taomlar'],
            ['🥗 Salatlar', '🥤 Ichimliklar'],
            ['◀️ Orqaga']
          ],
          resize_keyboard: true
        }
      });
      
    case '🛒 Savatcha':
      return ctx.reply('Sizning savatchangiz bo\'sh.');
      
    case 'ℹ️ Ma\'lumot':
      return ctx.reply('Biz haqimizda ma\'lumot...');
      
    case '☎️ Aloqa':
      return ctx.reply('Aloqa uchun: +998 90 123 45 67');
      
    // Admin panel options
    case '👥 Foydalanuvchilar':
      if (!ctx.user.isAdmin) return;
      
      return ctx.reply('Foydalanuvchilar ro\'yxati...');
      
    case '📢 Xabar yuborish':
      if (!ctx.user.isAdmin) return;
      
      await ctx.state.set('awaiting_broadcast_message');
      return ctx.reply('Barcha foydalanuvchilarga yubormoqchi bo\'lgan xabarni yuboring:', {
        reply_markup: {
          keyboard: [['❌ Bekor qilish']],
          resize_keyboard: true
        }
      });
      
    case '🏠 Asosiy menyu':
      return ctx.reply('Asosiy menyu:', mainMenu);
      
    case '❌ Bekor qilish':
      await ctx.state.clear();
      
      if (ctx.user.isAdmin) {
        return ctx.reply('Bekor qilindi.', adminMenu);
      } else {
        return ctx.reply('Bekor qilindi.', mainMenu);
      }
      
    case '◀️ Orqaga':
      if (ctx.user.isAdmin) {
        return ctx.reply('Asosiy menyu:', adminMenu);
      } else {
        return ctx.reply('Asosiy menyu:', mainMenu);
      }
      
    default:
      return ctx.reply('Tushunarsiz buyruq. Iltimos, menyudan foydalaning.');
  }
};