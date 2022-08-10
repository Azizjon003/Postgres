const mavzu = async (sequialize, DataTypes) => {
  const mavzu = sequialize.define("mavzu", {
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
      type: DataTypes.DataTypes.UUID,
      allowNull: false,
    },
  });
  return mavzu;
};

module.exports = mavzu;
