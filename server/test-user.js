import { adminGetAllUsers } from "./modals/user.modal.sequelize.js";
import fs from "fs";

async function test() {
  try {
    const users = await adminGetAllUsers();
    if (!users || users.length === 0) { console.log("No users"); return process.exit(); }
    const firstUser = users[0];
    const { password, ...rest } = firstUser;
    
    fs.writeFileSync("user-payload.json", JSON.stringify(rest, null, 2));
    console.log("WROTE OUTPUT");
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
}

test();
