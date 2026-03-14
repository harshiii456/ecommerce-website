import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const seed = async () => {
    const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.NAME,
        password: process.env.PASS,
    });

    try {
        console.log("Seeding sample data...");

        // 1. Add Categories
        console.log("Adding sample categories...");
        const [cat1] = await connection.query("INSERT INTO categories (category_name) VALUES ('Mobiles') ON DUPLICATE KEY UPDATE category_id=LAST_INSERT_ID(category_id)");
        const [cat2] = await connection.query("INSERT INTO categories (category_name) VALUES ('Laptops') ON DUPLICATE KEY UPDATE category_id=LAST_INSERT_ID(category_id)");
        const [cat3] = await connection.query("INSERT INTO categories (category_name) VALUES ('Electronics') ON DUPLICATE KEY UPDATE category_id=LAST_INSERT_ID(category_id)");

        const mobileId = cat1.insertId;
        const laptopId = cat2.insertId;
        const electronicsId = cat3.insertId;

        // 2. Add Products
        console.log("Adding sample products...");
        const products = [
            [mobileId, 'iPhone 15 Pro', 'Latest Apple iPhone with Titanium design', 999.99, 899.99, 50, 'https://images.unsplash.com/photo-1695048133142-1a73905dd30d?auto=format&fit=crop&q=80&w=400'],
            [mobileId, 'Samsung Galaxy S24 Ultra', 'Samsung flagship with AI features', 1199.99, 1099.99, 45, 'https://images.unsplash.com/photo-1707038162238-d63fa289650b?auto=format&fit=crop&q=80&w=400'],
            [laptopId, 'MacBook Air M3', 'Powerful and thin Apple laptop', 1099.00, 999.00, 30, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=400'],
            [laptopId, 'Dell XPS 13', 'Compact and powerful Windows laptop', 949.00, 899.00, 25, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&q=80&w=400'],
            [electronicsId, 'Sony WH-1000XM5', 'Industry leading noise cancelling headphones', 399.00, 349.00, 100, 'https://images.unsplash.com/photo-1628202926206-c63a34b1618f?auto=format&fit=crop&q=80&w=400']
        ];

        for (const p of products) {
            await connection.query(
                "INSERT INTO products (category_id, product_name, description, price, discount_price, stock_quantity, main_image_url) VALUES (?, ?, ?, ?, ?, ?, ?)",
                p
            );
        }

        console.log("SUCCESS: Sample data seeded.");
    } catch (error) {
        console.error("Seeding FAILED:", error.message);
    } finally {
        await connection.end();
    }
};

seed();
