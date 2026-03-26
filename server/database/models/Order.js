export const Order = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    order_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    shipping_address: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    payment_method: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    payment_status: {
      type: DataTypes.STRING(20),
      defaultValue: 'pending'
    }
  }, {
    tableName: 'orders',
    timestamps: false
  });

  Order.associate = (models) => {
    // Order belongs to User
    Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    
    // Order belongs to many Products through OrderItems
    Order.belongsToMany(models.Product, { 
      through: models.OrderItem, 
      foreignKey: 'order_id',
      otherKey: 'product_id',
      as: 'products'
    });
    
    // Order has many OrderItems
    Order.hasMany(models.OrderItem, { foreignKey: 'order_id', as: 'orderItems' });
  };

  return Order;
};
