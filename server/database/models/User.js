export const User = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    user_first_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    user_last_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    email_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    mobile_number: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    user_role_id: {
      type: DataTypes.TINYINT,
      defaultValue: 1 // 1 = customer, 2 = admin
    },
    refresh_token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    reset_password_token: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    reset_password_expire: {
      type: DataTypes.DATE,
      allowNull: true
    },
    role: {
      type: DataTypes.ENUM('admin', 'customer'),
      defaultValue: 'customer'
    }
  }, {
    tableName: 'user_master',
    timestamps: false
  });

  User.associate = (models) => {
    // User has many Orders
    User.hasMany(models.Order, { foreignKey: 'user_id', as: 'orders' });
    
    // User has one Cart
    User.hasOne(models.Cart, { foreignKey: 'user_id', as: 'cart' });
    
    // User has one Wishlist
    User.hasOne(models.Wishlist, { foreignKey: 'user_id', as: 'wishlist' });
    
    // User has many Reviews
    User.hasMany(models.Review, { foreignKey: 'user_id', as: 'reviews' });
  };

  return User;
};
