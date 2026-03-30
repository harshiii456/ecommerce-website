export const Wishlist = (sequelize, DataTypes) => {
  const Wishlist = sequelize.define('Wishlist', {
    wishlist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'user_master',
        key: 'user_id'
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'wishlist',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['product_id'] },
      { unique: true, fields: ['user_id', 'product_id'] }
    ]
  });

  Wishlist.associate = (models) => {
    // Wishlist entry belongs to a User
    Wishlist.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    
    // Wishlist entry belongs to a Product
    Wishlist.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  };

  return Wishlist;
};
