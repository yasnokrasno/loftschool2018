const Sequelize = require('sequelize');
const config = require('../config/config');
const sequelize = Sequelize(config.db.database, config.db.username, config.db.pass, {
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

for (const modelName in config.db.modelNames) {
  sequelize.import(`/models/${modelName}.js`);
}

sequelize.sync();
