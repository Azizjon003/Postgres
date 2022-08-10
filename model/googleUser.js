const googleUser = (sequelize, DataTypes) => {
  const googleUser = sequelize.define(
    "google",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      googleid: {
        type: DataTypes.STRING,
        unique: true,
      },
      name: {
        type: DataTypes.STRING,
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
      },
      emailActiv: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      photo: {
        type: DataTypes.STRING,
      },
    },
    {
      createdAt: false,
      updatedAt: false,
      id: DataTypes.UUID,
    }
  );
  return googleUser;
};

module.exports = googleUser;
