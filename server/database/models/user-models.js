import { DataTypes } from './user-database.js';

// Customer User Model
export const CustomerUser = (sequelize) => {
  const CustomerUser = sequelize.define('CustomerUser', {
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
      type: DataTypes.ENUM('customer'),
      defaultValue: 'customer'
    },
    customer_status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'active'
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    tableName: 'customer_users',
    timestamps: false
  });

  return CustomerUser;
};

// Customer OTP Verification Model
export const CustomerOTPVerification = (sequelize) => {
  const CustomerOTPVerification = sequelize.define('CustomerOTPVerification', {
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
    tableName: 'customer_otp_verifications',
    timestamps: false
  });

  return CustomerOTPVerification;
};
