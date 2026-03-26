export const Cart = (sequelize, DataTypes) => {
  const Cart = sequelize.define('Cart', {
    cart_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'user_master',
        key: 'user_id'
      }
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
    tableName: 'cart',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['user_id'] }
    ]
  });

  Cart.associate = (models) => {
    // Cart belongs to User
    Cart.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    
    // Cart has many CartItems
    Cart.hasMany(models.CartItem, { foreignKey: 'cart_id', as: 'cartItems' });
  };

  return Cart;
};
