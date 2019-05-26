const config = require('../config/config');
const path = require('path');
const viewFileName = path.join(process.cwd(), 'public', config.viewFileName);

module.exports.getIndex = function (req, res, next) {
  res.send(viewFileName);
};
