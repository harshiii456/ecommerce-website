import { DataTypes } from './admin-database.js';

// Admin User Model
export const AdminUser = (sequelize) => {
  const AdminUser = sequelize.define('AdminUser', {
    admin_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    admin_first_name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    admin_last_name: {
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
      type: DataTypes.ENUM('super_admin', 'admin'),
      defaultValue: 'admin'
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        users: ['read', 'write', 'delete'],
        products: ['read', 'write', 'delete'],
        orders: ['read', 'write', 'delete'],
        categories: ['read', 'write', 'delete']
      }
    }
  }, {
    tableName: 'admin_users',
    timestamps: false
  });

  return AdminUser;
};

// Admin OTP Verification Model
export const AdminOTPVerification = (sequelize) => {
  const AdminOTPVerification = sequelize.define('AdminOTPVerification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING(6),
      allowNull: false
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    is_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'admin_otp_verifications',
    timestamps: false
  });

  return AdminOTPVerification;
};
