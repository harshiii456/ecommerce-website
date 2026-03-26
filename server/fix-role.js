import { sequelize } from "./database/database.js";

async function fix() {
  try {
    await sequelize.authenticate();
    await sequelize.query("UPDATE user_master SET role = 'customer' WHERE email_id = 'harshita.g.2k@gmail.com'");
    console.log("Updated harshita to customer!");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}
fix();
