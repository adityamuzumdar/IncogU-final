// utils/emailUtils.js
const mapper = {
    'coeptech.ac.in': 'Coep',
    'iitb.ac.in': 'IIT Bombay',
}

const checkEmailDomain = (email) => {
    const domain = email.split('@')[1];
    return mapper[domain];
  };
  
  module.exports = { checkEmailDomain };