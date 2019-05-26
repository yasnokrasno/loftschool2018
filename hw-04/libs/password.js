const crypto = require('crypto');

module.exports.generatePassword = (password, salt) => {
  return crypto.pbkdf2Sync(password, salt, 1000, 512, 'sha512')
    .toString('hex');
};

module.exports.checkPassword = (password, salt, hash) => {
  const generatedHash = crypto
    .pbkdf2Sync(password, salt, 1000, 512, 'sha512')
    .toString('hex');
  return hash === generatedHash;
};
