import { adminGetAllUsers } from "./modals/user.modal.sequelize.js";

async function testAdminUsersAPI() {
  try {
    console.log("=== TESTING ADMIN USERS API DIRECTLY ===");
    
    const users = await adminGetAllUsers();
    
    console.log(`✅ Found ${users.length} users:`);
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email_id} - ${user.user_first_name} ${user.user_last_name} (${user.role})`);
    });
    
    console.log("=== ADMIN USERS API TEST SUCCESSFUL ===");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testAdminUsersAPI();
