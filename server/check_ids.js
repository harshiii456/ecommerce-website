import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const checkIds = async () => {
    const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.NAME,
        password: process.env.PASS,
    });

    try {
        const [rows] = await connection.query("SELECT category_id, category_name FROM categories");
        console.log("Categories in DB:", JSON.stringify(rows, null, 2));
    } catch (error) {
        console.error("Check FAILED:", error.message);
    } finally {
        await connection.end();
    }
};

checkIds();
