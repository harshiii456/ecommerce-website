import { sequelize } from "./database/database.js";
import models from "./database/models/index.js";
import fs from "fs";

async function test() {
  try {
    await sequelize.authenticate();
    const { OTPVerification } = models;
    const found = await OTPVerification.findOne({
      where: { 
        email_id: "test@example.com",
        is_verified: 0,
        expires_at: { [sequelize.Sequelize.Op.gt]: new Date() }
      },
      order: [['created_at', 'DESC']]
    });
    console.log("SUCCESS");
  } catch (error) {
    fs.writeFileSync("test-error2.txt", String(error.original ? error.original.message : error.message));
  } finally {
    process.exit();
  }
}

test();
