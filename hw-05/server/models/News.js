module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('news', {
    id: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    }
  });
  return News;
};
