const Sequelize = require('sequelize');
const config = require('../config/config');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize(
  config.db.database,
  config.db.username,
  config.db.pass,
  {
    host: config.db.host,
    dialect: config.db.dialect,
    pool: config.db.pool
  });

sequelize.authenticate()
  .then(() => {
    console.log('Sequelize connected...');
  })
  .catch(() => {
    console.log('Error connecting Sequelize to database');
  });

fs.readdirSync(path.join(__dirname, '..', 'models'))
  .forEach((fileName) => {
    if (config.db.modelNames.indexOf(path.basename(fileName, '.js') >= 0)) {
      sequelize.import(path.join(__dirname, '..', 'models', fileName));
    }
  });

Object.keys(sequelize.models).forEach((modelName) => {
  if ('associate' in sequelize.models[modelName]) {
    sequelize.models[modelName].associate(sequelize.models);
  }
});

sequelize.sync();

module.exports = sequelize;
