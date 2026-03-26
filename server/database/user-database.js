import { Sequelize, DataTypes } from "sequelize";

const userSequelize = new Sequelize(
  process.env.USER_DB_NAME || 'ecommerce_users',
  process.env.USER_DB_USER || process.env.USER,
  process.env.USER_DB_PASS || process.env.PASS,
  {
    host: process.env.USER_DB_HOST || process.env.HOST,
    dialect: "mysql",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

const connectUserDB = async () => {
  try {
    await userSequelize.authenticate();
    console.log("User database connected successfully!");
  } catch (error) {
    console.error("User database connection failed:", error);
    process.exit(1);
  }
};

const connectUserEndDB = async () => {
  try {
    await userSequelize.close();
    console.log("User database connection closed successfully!");
  } catch (error) {
    console.error("Error closing user database connection:", error);
    process.exit(1);
  }
};

export { connectUserDB, connectUserEndDB, userSequelize, DataTypes };
