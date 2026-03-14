import { databaseInstance, connectDB } from "./database/database.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const runDiagnostics = async () => {
    try {
        await connectDB();
        console.log("Connected to database for diagnostics.");

        console.log("\n--- Checking user_master table ---");
        try {
            const [columns] = await databaseInstance.query("SHOW COLUMNS FROM user_master");
            console.log("Columns in user_master:");
            console.table(columns.map(c => ({ Field: c.Field, Type: c.Type })));
        } catch (e) {
            console.error("Error checking user_master:", e.message);
        }

        console.log("\n--- Checking if otp_verification table exists ---");
        try {
            const [tables] = await databaseInstance.query("SHOW TABLES LIKE 'otp_verification'");
            if (tables.length > 0) {
                console.log("otp_verification table EXISTS.");
            } else {
                console.log("otp_verification table is MISSING!");
            }
        } catch (e) {
            console.error("Error checking otp_verification:", e.message);
        }

        process.exit(0);
    } catch (error) {
        console.error("Diagnostic failed:", error);
        process.exit(1);
    }
};

runDiagnostics();
