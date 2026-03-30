import mysql from "mysql2/promise";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: "./.env" });

const writeIds = async () => {
    const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.NAME,
        password: process.env.PASS,
    });

    try {
        const [rows] = await connection.query("SELECT category_id, category_name FROM categories");
        fs.writeFileSync("categories_ids.json", JSON.stringify(rows, null, 2));
        console.log("Success");
    } catch (error) {
        console.error("FAILED:", error.message);
    } finally {
        await connection.end();
    }
};

writeIds();
