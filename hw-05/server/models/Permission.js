const permissionDefaultJsonValue = '{"C":false,"R":false,"U":false,"D":false}';

module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('permission', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true
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
      comment: 'Permissions for chat section'
    },
    settings: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: permissionDefaultJsonValue,
      comment: 'Permissions for settings section'
    }
  });

  Permission.associate = (models) => {
    Permission.belongsTo(models.user, { foreignKey: 'uid' });
  };

  return Permission;
};
