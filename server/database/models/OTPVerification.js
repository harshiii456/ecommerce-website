export const OTPVerification = (sequelize, DataTypes) => {
  const OTPVerification = sequelize.define('OTPVerification', {
    otp_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    email_id: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING(10),
      allowNull: false,
      field: 'otp_code'
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'otp_code_expires'
    },
    is_verified: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      field: 'verification_attempt'
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'otp_verification',
    timestamps: false,
    indexes: [
      { fields: ['email_id'] }
    ]
  });

  // No association since user_id doesn't exist in the actual table
  OTPVerification.associate = (models) => {
    // No association needed as the table only uses email_id
  };

  return OTPVerification;
};
