import { DataTypes } from "sequelize";
import { sequelize } from "../config/sequelize.js";

const FileRecord = sequelize.define("FileRecord", {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

export { FileRecord };

sequelize
  .sync()
  .then(() => {
    console.log("FileRecord table created");
  })
  .catch((error) => {
    console.error("Error creating FileRecord table", error);
  });
