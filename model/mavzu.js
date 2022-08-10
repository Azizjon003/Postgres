const mavzu = (sequialize, DataTypes) => {
  const mavzu = sequialize.define(
    "mavzu",
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      mavzu: {
        type: DataTypes.STRING(1024),
        allowNull: false,
      },
      fanId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "fans",
          key: "id",
        },
      },
    },
    {
      timeStamps: false,
      createdAt: false,
      updatedAt: false,
    }
  );
  return mavzu;
};

module.exports = mavzu;
