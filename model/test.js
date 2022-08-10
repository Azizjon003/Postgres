const TestModel = (sequialize, DataTypes) => {
  const test = sequialize.define(
    "test",
    {
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
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      mavzuId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "mavzus",
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
  return test;
};

module.exports = TestModel;
