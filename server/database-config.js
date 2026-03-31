import { Sequelize, DataTypes } from "sequelize";

// Temporary database configuration for testing
const sequelize = new Sequelize(
  "rshop",  // Database name
  "root",
  "Harshita@0456",
  {
    host: "localhost",
    dialect: "mysql",
    logging: console.log,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,  
    },
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
};

export { connectDB, sequelize, DataTypes };
