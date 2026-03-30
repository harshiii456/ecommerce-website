import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { sequelize } from "./database/database.js";
import { QueryTypes } from "sequelize";

const checkCategories = async () => {
    try {
        await sequelize.authenticate();
        console.log("Database connected.");

        const results = await sequelize.query(
            "SELECT * FROM categories",
            { type: QueryTypes.SELECT }
        );
        console.log("Current Categories:", results);
    } catch (error) {
        console.error("Check FAILED:", error.message);
    } finally {
        await sequelize.close();
    }
};

checkCategories();
