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

const update = async () => {
    try {
        await sequelize.authenticate();
        console.log("Updating problematic image URL for ipad 10th generation...");
        // Using a clean Unsplash URL instead
        const newUrl = "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=400";
        await sequelize.query(
            "UPDATE products SET main_image_url = ? WHERE product_id = 6",
            { replacements: [newUrl], type: QueryTypes.UPDATE }
        );
        console.log("SUCCESS: Image URL updated.");
    } catch (err) {
        console.error(err);
    } finally {
        await sequelize.close();
    }
};

update();
