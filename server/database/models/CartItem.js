export const CartItem = (sequelize, DataTypes) => {
  const CartItem = sequelize.define('CartItem', {
    cart_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    cart_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'cart',
        key: 'cart_id'
      }
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'product_id'
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'cart_items',
    timestamps: false,
    indexes: [
      { fields: ['cart_id'] },
      { fields: ['product_id'] },
      { unique: true, fields: ['cart_id', 'product_id'] }
    ]
  });

  CartItem.associate = (models) => {
    // CartItem belongs to Cart
    CartItem.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
    
    // CartItem belongs to Product
    CartItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  };

  return CartItem;
};
