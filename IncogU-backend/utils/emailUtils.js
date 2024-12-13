// utils/emailUtils.js

// Example for checking university email domain
const checkEmailDomain = (email) => {
    const domain = email.split('@')[1];
    // Assuming the domain of the university is '.edu'
    return domain.endsWith('.in');
  };
  
  module.exports = { checkEmailDomain };