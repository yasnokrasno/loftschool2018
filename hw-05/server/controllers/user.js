const dataService = require('../services/dataService');

module.exports.createUser = function (req, res, next) {
  const requestJSON = JSON.parse(req.body);
  const newUser = dataService.addUser(requestJSON);
  res.send(newUser);
};
