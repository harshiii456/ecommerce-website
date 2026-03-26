import { sequelize, DataTypes } from '../database.js';
import { User } from './User.js';
import { Category } from './Category.js';
import { Product } from './Product.js';
import { Order } from './Order.js';
import { OrderItem } from './OrderItem.js';
import { Cart } from './Cart.js';
import { CartItem } from './CartItem.js';
import { Wishlist } from './Wishlist.js';
import { WishlistItem } from './WishlistItem.js';
import { Review } from './Review.js';
import { OTPVerification } from './OTPVerification.js';

// Initialize all models (using main database for now)
const models = {
  User: User(sequelize, DataTypes),
  Category: Category(sequelize, DataTypes),
  Product: Product(sequelize, DataTypes),
  Order: Order(sequelize, DataTypes),
  OrderItem: OrderItem(sequelize, DataTypes),
  Cart: Cart(sequelize, DataTypes),
  CartItem: CartItem(sequelize, DataTypes),
  Wishlist: Wishlist(sequelize, DataTypes),
  WishlistItem: WishlistItem(sequelize, DataTypes),
  Review: Review(sequelize, DataTypes),
  OTPVerification: OTPVerification(sequelize, DataTypes),
};

// Setup associations
Object.keys(models).forEach(modelName => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
});

export { sequelize, models };
export default models;
