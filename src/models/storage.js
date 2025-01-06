import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const StorageRecord = sequelize.define("FileRecord", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  storage: {
    type: DataTypes.NUMBER,
    allowNull: false,
  },
});

export { StorageRecord };

sequelize
  .sync()
  .then(() => {
    console.log("StorageRecord table created");
  })
  .catch((error) => {
    console.error("Error creating StorageRecord table", error);
  });
