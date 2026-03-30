export const Review = (sequelize, DataTypes) => {
  const Review = sequelize.define('Review', {
    review_id: {
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
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5
      }
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'reviews',
    timestamps: false,
    indexes: [
      { fields: ['user_id'] },
      { fields: ['product_id'] },
      { unique: true, fields: ['user_id', 'product_id'] }
    ]
  });

  Review.associate = (models) => {
    // Review belongs to User
    Review.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    
    // Review belongs to Product
    Review.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  };

  return Review;
};
