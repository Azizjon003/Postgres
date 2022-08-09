const googleUser = (sequelize, DataTypes) => {
  const googleUser = sequelize.define("googleUser", {
    googleid: {
      type: DataTypes.STRING,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
  });
};

module.exports = googleUser;
