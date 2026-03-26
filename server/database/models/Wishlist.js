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
    tableName: 'wishlist',
    timestamps: false,
    indexes: [
      { unique: true, fields: ['user_id'] }
    ]
  });

  Wishlist.associate = (models) => {
    // Wishlist belongs to User
    Wishlist.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    
    // Wishlist has many WishlistItems
    Wishlist.hasMany(models.WishlistItem, { foreignKey: 'wishlist_id', as: 'wishlistItems' });
  };

  return Wishlist;
};
