import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
import { Sequelize, QueryTypes } from "sequelize";

const sequelize = new Sequelize(
  process.env.NAME,
  process.env.USER,
  process.env.PASS,
  {
    host: process.env.HOST,
    dialect: "mysql",
    logging: false,
  }
);

const check = async () => {
    try {
        await sequelize.authenticate();
        console.log("Checking DB for strange image names...");
        const results = await sequelize.query(
            "SELECT product_id, product_name, main_image_url FROM products WHERE main_image_url LIKE '%Recovered%'",
            { type: QueryTypes.SELECT }
        );
        console.log("Found:", results);
    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
};

check();
