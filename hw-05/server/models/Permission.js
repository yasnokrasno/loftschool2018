const User = require('User');
const permissionDefaultJsonValue = '{"C":false,"R":false,"U":false,"D":false}';
module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('permission', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      unique: false,
      reference: {
        model: User,
        key: 'id'
      }
    },
    news: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: permissionDefaultJsonValue,
      comment: 'Permissions for news section'
    },
    chat: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: permissionDefaultJsonValue,
      comment: 'Permissions for news section'
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: permissionDefaultJsonValue,
      comment: 'Permissions for news section'
    }
  });
  return Permission;
};
