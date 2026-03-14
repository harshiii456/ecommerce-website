import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const migrate = async () => {
    const connection = await mysql.createConnection({
        host: process.env.HOST,
        user: process.env.USER,
        database: process.env.NAME,
        password: process.env.PASS,
    });

    try {
        console.log("Starting corrected database reconstruction...");

        // 1. user_master
        console.log("Ensuring user_master...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS user_master (
                user_id INT AUTO_INCREMENT PRIMARY KEY,
                user_first_name VARCHAR(100) NULL,
                user_last_name VARCHAR(100) NULL,
                email_id VARCHAR(150) NOT NULL UNIQUE,
                password VARCHAR(255) NULL,
                mobile_number VARCHAR(20) NULL,
                user_role_id INT DEFAULT 1,
                user_status TINYINT(1) DEFAULT 0,
                refresh_token TEXT NULL,
                reset_password_token VARCHAR(255) NULL,
                reset_password_expire DATETIME NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 2. otp_verification
        console.log("Ensuring otp_verification...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS otp_verification (
                otp_id INT AUTO_INCREMENT PRIMARY KEY,
                email_id VARCHAR(150) NOT NULL,
                otp_code VARCHAR(10) NOT NULL,
                otp_code_expires DATETIME NOT NULL,
                verification_attempt INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // 3. categories
        console.log("Ensuring categories...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS categories (
                category_id INT AUTO_INCREMENT PRIMARY KEY,
                category_name VARCHAR(100) NOT NULL UNIQUE,
                parent_category_id INT DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (parent_category_id) REFERENCES categories(category_id) ON DELETE SET NULL
            )
        `);

        // 4. products
        console.log("Ensuring products...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS products (
                product_id INT AUTO_INCREMENT PRIMARY KEY,
                category_id INT NULL,
                product_name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                discount_price DECIMAL(10, 2) DEFAULT NULL,
                stock_quantity INT NOT NULL DEFAULT 0,
                main_image_url VARCHAR(255),
                is_active TINYINT(1) DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL
            )
        `);

        // 5. cart
        console.log("Ensuring cart...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cart (
                cart_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user_master(user_id) ON DELETE CASCADE
            )
        `);

        // 6. cart_items
        console.log("Ensuring cart_items...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS cart_items (
                cart_item_id INT AUTO_INCREMENT PRIMARY KEY,
                cart_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (cart_id) REFERENCES cart(cart_id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
                UNIQUE KEY unique_cart_product (cart_id, product_id)
            )
        `);

        // 7. wishlist
        console.log("Ensuring wishlist...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS wishlist (
                wishlist_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                product_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user_master(user_id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
                UNIQUE KEY unique_wishlist_product (user_id, product_id)
            )
        `);

        // 8. orders
        console.log("Ensuring orders...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS orders (
                order_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                order_status ENUM('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
                payment_status ENUM('PENDING', 'PAID', 'FAILED') DEFAULT 'PENDING',
                shipping_address TEXT NOT NULL,
                payment_method VARCHAR(50) DEFAULT 'CARD',
                transaction_id VARCHAR(100) DEFAULT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES user_master(user_id) ON DELETE CASCADE
            )
        `);

        // 9. order_items
        console.log("Ensuring order_items...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                order_item_id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NULL,
                quantity INT NOT NULL,
                unit_price DECIMAL(10, 2) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE SET NULL
            )
        `);

        // 10. reviews
        console.log("Ensuring reviews...");
        await connection.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                review_id INT AUTO_INCREMENT PRIMARY KEY,
                product_id INT NOT NULL,
                user_id INT NOT NULL,
                rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE,
                FOREIGN KEY (user_id) REFERENCES user_master(user_id) ON DELETE CASCADE,
                UNIQUE KEY unique_user_product_review (user_id, product_id)
            )
        `);

        console.log("SUCCESS: All database tables are ready.");
        process.exit(0);
    } catch (error) {
        console.error("Migration FAILED:", error.message);
        process.exit(1);
    } finally {
        await connection.end();
    }
};

migrate();
