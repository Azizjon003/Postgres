const TestModel = async (sequialize, DataTypes) => {
  const test = sequialize.define("test", {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    savol: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    variant: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    variant1: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    variant2: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    togrijavob: {
      type: DataTypes.STRING(1024),
      allowNull: false,
    },
    userId: {
      type: DataTypes.Array(DataTypes.UUID),
      allowNull: false,
      references: {
        model: "user",
        key: "id",
      },
    },
    fanId: {
      type: DataTypes.Array(DataTypes.UUID),
      allowNull: false,
      references: {
        model: "fan",
        key: "id",
      },
    },
  });
  return test;
};

module.exports = TestModel;
