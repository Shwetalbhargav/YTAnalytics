// Example: Basic validation helpers

const validateEmail = (email) => {
    const regex = /^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$/;
    return regex.test(email);
  };
  
  const validatePassword = (password) => {
    return typeof password === 'string' && password.length >= 6;
  };
  
  const validateChannelId = (channelId) => {
    return typeof channelId === 'string' && channelId.length > 10;
  };
  
  module.exports = {
    validateEmail,
    validatePassword,
    validateChannelId,
  };
  
