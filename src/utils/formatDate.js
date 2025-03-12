// src/utils/formatDate.js
module.exports = {
    formatDate: (date) => {
      const d = new Date(date);
      return d.toLocaleString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    
    formatDateShort: (date) => {
      const d = new Date(date);
      return d.toLocaleString('uz-UZ', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      });
    }
  };
  