export const WishlistItem = (sequelize, DataTypes) => {
  const WishlistItem = sequelize.define('WishlistItem', {
    wishlist_item_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    wishlist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'wishlist',
        key: 'wishlist_id'
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
    tableName: 'wishlist_items',
    timestamps: false,
    indexes: [
      { fields: ['wishlist_id'] },
      { fields: ['product_id'] },
      { unique: true, fields: ['wishlist_id', 'product_id'] }
    ]
  });

  WishlistItem.associate = (models) => {
    // WishlistItem belongs to Wishlist
    WishlistItem.belongsTo(models.Wishlist, { foreignKey: 'wishlist_id', as: 'wishlist' });
    
    // WishlistItem belongs to Product
    WishlistItem.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  };

  return WishlistItem;
};
