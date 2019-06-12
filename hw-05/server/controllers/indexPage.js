const config = require('../config/config');
const path = require('path');
const templateFilePath = path.join(process.cwd(), 'public', config.templateFileName);

module.exports.getIndex = function (req, res, next) {
  res.send(templateFilePath);
};
