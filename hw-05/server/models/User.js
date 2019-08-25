const bCpypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    middleName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    surName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    img: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    createdAt: false,
    updatedAt: false
  });

  // late models binding. Starts in services/Sequelize.js after importing
  User.associate = (models) => {
    User.hasMany(models.news, { foreignKey: 'uid' });
    User.hasOne(models.permission, { foreignKey: 'uid' });
  };
  /**
   * Create a password hash.
   * @param rawPasswordString {String} Raw inputed password to create a hash
   * @returns {String} Hashed password string
   */
  User.createPasswordHash = (rawPasswordString) => {
    return bCpypt.hashSync(rawPasswordString, bCpypt.genSaltSync(10), null);
  };
  User.validatePasswordHash = (inputedPasswordString, storedPasswordHash) => {
    return bCpypt.compareSync(inputedPasswordString, storedPasswordHash);
  };
  return User;
};
