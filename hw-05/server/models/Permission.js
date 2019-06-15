const { Sequelize } = require('sequelize');

class Permission extends Sequelize.Model {
  associate (models) {
    this.belongsTo(models.user, { foreignKey: 'uid' });
  }
}

module.exports = (sequelize, DataTypes) => {
  const permissionDefaultJsonValue = '{"C":false,"R":false,"U":false,"D":false}';
  Permission.init(
    {
      id: {
        type: DataTypes.INTEGER,
        unique: true,
        primaryKey: true,
        autoIncrement: true
      },
      news: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
        defaultValue: permissionDefaultJsonValue,
        comment: 'Permissions for news section',
        set: function (val) {
          return this.setDataValue('news', JSON.stringify(val));
        },
        get: function () {
          return JSON.parse(this.getDataValue('news'));
        }
      },
      chat: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
        defaultValue: permissionDefaultJsonValue,
        comment: 'Permissions for chat section',
        set: function (val) {
          return this.setDataValue('chat', JSON.stringify(val));
        },
        get: function () {
          return JSON.parse(this.getDataValue('chat'));
        }
      },
      setting: {
        type: DataTypes.TEXT('tiny'),
        allowNull: false,
        defaultValue: permissionDefaultJsonValue,
        comment: 'Permissions for settings section',
        set: function (val) {
          return this.setDataValue('setting', JSON.stringify(val));
        },
        get: function () {
          return JSON.parse(this.getDataValue('setting'));
        }
      }
    },
    {
      sequelize,
      modelName: 'permission',
      createdAt: false,
      updatedAt: false
    }
  );
  // late models binding. Starts in services/Sequelize.js after importing
  return Permission;
};
