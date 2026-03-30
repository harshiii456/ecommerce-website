import { Sequelize, DataTypes } from "sequelize";

// Main database connection (for shared data like products, orders, etc.)
const sequelize = new Sequelize(
  process.env.NAME,
  process.env.USER || 'root',
  process.env.PASS || '',
  {
    host: process.env.HOST || 'localhost',
    dialect: "mysql",
    logging: console.log, // Enable logging to debug
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
    console.log("Main database connected successfully!");
  } catch (error) {
    console.error("Main database connection failed:", error);
    process.exit(1);
  }
};

const connectEndDB = async () => {
  try {
    await sequelize.close();
    console.log("Main database connection closed successfully!");
  } catch (error) {
    console.error("Error closing main database connection:", error);
    process.exit(1);
  }
};

export { connectDB, connectEndDB, sequelize, DataTypes };
