module.exports = async (ctx) => {
    const state = await ctx.state.get();
    if (state === 'register_phone') {
      const phoneNumber = ctx.message.contact.phone_number;
      
      // Ensure the phone number starts with +998
      const formattedPhoneNumber = phoneNumber.startsWith('+998') 
        ? phoneNumber 
        : '+998' + phoneNumber.replace(/^998/, '');
  
      await ctx.state.setStateAndValue('register_address', 'phone', formattedPhoneNumber);
      return ctx.reply('Iltimos, manzilingizni kiriting:', {
        reply_markup: {
          remove_keyboard: true
        }
      });
    } else {
      // Handle unexpected contact sharing
      return ctx.reply('Kechirasiz, hozir telefon raqamini kiritish kutilmayapti.');
    }
  };