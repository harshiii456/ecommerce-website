export const Product = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    product_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    product_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    discount_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },
    stock_quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    is_active: {
      type: DataTypes.TINYINT,
      defaultValue: 1
    },
    main_image_url: {
      type: DataTypes.STRING(1000),
      allowNull: true
    }
  }, {
    tableName: 'products',
    timestamps: false
  });

  Product.associate = (models) => {
    // Product belongs to Category
    Product.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    
    // Product belongs to many Orders through OrderItems
    Product.belongsToMany(models.Order, { 
      through: models.OrderItem, 
      foreignKey: 'product_id',
      otherKey: 'order_id',
      as: 'orders'
    });
    
    // Product has many CartItems
    Product.hasMany(models.CartItem, { foreignKey: 'product_id', as: 'cartItems' });
    
    // Product has many WishlistItems
    Product.hasMany(models.WishlistItem, { foreignKey: 'product_id', as: 'wishlistItems' });
    
    // Product has many Reviews
    Product.hasMany(models.Review, { foreignKey: 'product_id', as: 'reviews' });
  };

  return Product;
};
