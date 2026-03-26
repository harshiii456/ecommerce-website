import { sequelize } from "./database/database.js";
import fs from "fs";

async function test() {
  try {
    const [results] = await sequelize.query("DESCRIBE otp_verification");
    fs.writeFileSync("table-schema.json", JSON.stringify(results, null, 2));
  } catch (error) {
    fs.writeFileSync("table-schema-error.txt", error.message);
  } finally {
    process.exit();
  }
}

test();
