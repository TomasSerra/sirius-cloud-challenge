import { Sequelize } from "sequelize";

const sequelize = new Sequelize("cloud-db", "admin", "admin", {
  host: "localhost",
  dialect: "postgres",
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log("Success connection to the database");
  })
  .catch((error) => {
    console.error("Could not connect to the database", error);
  });
