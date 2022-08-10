const fan = (sequialize, DataTypes) => {
  const fan = sequialize.define(
    "fan",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      fan: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        unique: true,
      },
    },
    {
      timeStamps: false,
      createdAt: false,
      updatedAt: false,
    }
  );
  return fan;
};

module.exports = fan;
