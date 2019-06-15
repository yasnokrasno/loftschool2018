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
      allowNull: false,
      unique: false
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
      unique: false
    },
    theme: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    }
  },
  {
    createdAt: false,
    updatedAt: false
  });

  // late models binding. Starts in services/Sequelize.js after importing
  News.associate = (models) => {
    News.belongsTo(models.user, { foreignKey: 'uid' });
  };

  return News;
};
