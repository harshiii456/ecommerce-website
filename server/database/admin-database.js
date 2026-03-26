import { Sequelize, DataTypes } from "sequelize";

const adminSequelize = new Sequelize(
  process.env.ADMIN_DB_NAME || 'ecommerce_admin',
  process.env.ADMIN_DB_USER || process.env.USER,
  process.env.ADMIN_DB_PASS || process.env.PASS,
  {
    host: process.env.ADMIN_DB_HOST || process.env.HOST,
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

const connectAdminDB = async () => {
  try {
    await adminSequelize.authenticate();
    console.log("Admin database connected successfully!");
  } catch (error) {
    console.error("Admin database connection failed:", error);
    process.exit(1);
  }
};

const connectAdminEndDB = async () => {
  try {
    await adminSequelize.close();
    console.log("Admin database connection closed successfully!");
  } catch (error) {
    console.error("Error closing admin database connection:", error);
    process.exit(1);
  }
};

export { connectAdminDB, connectAdminEndDB, adminSequelize, DataTypes };
