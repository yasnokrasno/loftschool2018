module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('news', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },
    date: {
      type: DataTypes.DATE,
      unique: false
    },
    text: {
      type: DataTypes.TEXT,
      unique: false
    },
    theme: {
      type: DataTypes.STRING,
      unique: false
    }
  });
  News.associate = (models) => {
    News.belongsTo(models.user, { foreignKey: 'uid' });
  };
  return News;
};
