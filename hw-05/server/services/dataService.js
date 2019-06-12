let mockUser = {
  access_token: '23453ff6er354fas',
  firstName: 'test1',
  id: 12344,
  middleName: 'test2',
  password: '',
  permission: {
    chat: { C: true, R: true, U: true, D: true },
    news: { C: true, R: true, U: true, D: true },
    setting: { C: true, R: true, U: true, D: true }
  },
  permissionId: 1234,
  surName: 'test3',
  username: 'testuser'
};
const sequelise = require('../services/Sequelize');
const User = require('../models/User');

module.exports.addUser = function () {
  return mockUser;
};
