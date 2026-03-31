import { sequelize, models } from "./database/models/index.js";

const { Product } = models;

async function checkPrices() {
  try {
    await sequelize.authenticate();
    const products = await Product.findAll({ 
      attributes: ['product_name', 'price', 'discount_price'],
      limit: 5 
    });
    console.log('PRODUCT PRICES:');
    products.forEach(p => {
      console.log(`${p.product_name}: price=${p.price} (type: ${typeof p.price}), discount=${p.discount_price} (type: ${typeof p.discount_price})`);
    });
    await sequelize.close();
  } catch (error) {
    console.error('Error:', error);
  }
}

checkPrices();
