import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import models from "../database/models/index.js";
import { sequelize } from "../database/database.js";

const { User, OTPVerification } = models;

// Create new user
const newUser = async (userData) => {
  try {
    const user = await User.create({
      user_role_id: 1,
      email_id: userData.email_id,
      password: userData.password,
      user_status: 0,
      role: 'customer'
    });
    return user;
  } catch (error) {
    console.error("DB Error in newUser:", error);
    throw new ErrorHandler(500, "Error creating user");
  }
};

// Find user by email
const findUserByEmail = async (email) => {
  try {
    const user = await User.findOne({
      where: { email_id: email },
      attributes: [
        'user_id', 'user_first_name', 'user_last_name', 'email_id', 
        'password', 'user_role_id', 'mobile_number', 
        'reset_password_token', 'reset_password_expire', 'role'
      ]
    });
    return user ? [user] : [];
  } catch (error) {
    console.error("DB Error in findUserByEmail:", error);
    throw new ErrorHandler(500, "Error finding user by email");
  }
};

// Find user by ID
const findUser = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: [
        'user_id', 'user_first_name', 'user_last_name', 'email_id', 
        'mobile_number', 'user_role_id', 'refresh_token', 
        'reset_password_token', 'reset_password_expire', 'role'
      ]
    });
    return user ? [user] : [];
  } catch (error) {
    console.error("DB Error in findUser:", error);
    throw new ErrorHandler(500, "Error finding user");
  }
};

// Update user
const updateUser = async (userData) => {
  try {
    const [affectedCount] = await User.update(userData, {
      where: { user_id: userData.user_id }
    });
    return affectedCount > 0;
  } catch (error) {
    console.error("DB Error in updateUser:", error);
    throw new ErrorHandler(500, "Error updating user");
  }
};

// Update refresh token
const updateRefreshToken = async (userData) => {
  try {
    const [affectedCount] = await User.update(
      { refresh_token: userData.refreshToken },
      { where: { user_id: userData.user_id } }
    );
    return affectedCount > 0;
  } catch (error) {
    console.error("DB Error in updateRefreshToken:", error);
    throw new ErrorHandler(500, "Error updating refresh token");
  }
};

// Delete user
const deleteUser = async (userId) => {
  try {
    const affectedCount = await User.destroy({
      where: { user_id: userId }
    });
    return affectedCount > 0;
  } catch (error) {
    console.error("DB Error in deleteUser:", error);
    throw new ErrorHandler(500, "Error deleting user");
  }
};

// Generate access token
const generateAccessToken = function (user_id, role) {
  return jwt.sign({ id: user_id, role: role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
  });
};

// Generate refresh token
const generateRefreshToken = function (user_id, role) {
  return jwt.sign({ id: user_id, role: role }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });
};

// OTP Verification functions
const createOTP = async (otpData) => {
  try {
    const otp = await OTPVerification.create({
      email_id: otpData.email_id,
      otp: otpData.otp,
      expires_at: otpData.expires_at
    });
    return otp;
  } catch (error) {
    console.error("DB Error in createOTP:", error);
    throw new ErrorHandler(500, "Error creating OTP");
  }
};

const findOTP = async (email) => {
  try {
    const otp = await OTPVerification.findOne({
      where: { 
        email_id: email,
        is_verified: 0,
        expires_at: { [sequelize.Sequelize.Op.gt]: new Date() }
      },
      order: [['created_at', 'DESC']]
    });
    return otp ? [otp] : [];
  } catch (error) {
    console.error("DB Error in findOTP:", error);
    throw new ErrorHandler(500, "Error finding OTP");
  }
};

const updateOTPVerification = async (email) => {
  try {
    const [affectedCount] = await OTPVerification.update(
      { is_verified: 1 },
      { 
        where: { 
          email_id: email,
          is_verified: 0
        }
      }
    );
    return affectedCount > 0;
  } catch (error) {
    console.error("DB Error in updateOTPVerification:", error);
    throw new ErrorHandler(500, "Error updating OTP verification");
  }
};

// Admin functions
const adminGetAllUsers = async () => {
  try {
    console.log("Fetching all users for admin");
    
    const users = await User.findAll({
      attributes: [
        'user_id', 'user_first_name', 'user_last_name', 'email_id', 
        'mobile_number', 'user_role_id', 'role'
      ]
    });
    
    console.log("Found users:", users.length);
    return users;
  } catch (error) {
    console.error("DB Error in adminGetAllUsers:", error);
    throw new ErrorHandler(500, "Error fetching all users");
  }
};

const adminDeleteUser = async (userId) => {
  try {
    const affectedCount = await User.destroy({
      where: { user_id: userId }
    });
    return affectedCount > 0;
  } catch (error) {
    console.error("DB Error in adminDeleteUser:", error);
    throw new ErrorHandler(500, "Error deleting user");
  }
};

const adminUpdateUserRole = async (userId, role) => {
  try {
    const [affectedCount] = await User.update(
      { role: role },
      { where: { user_id: userId } }
    );
    return affectedCount > 0;
  } catch (error) {
    console.error("DB Error in adminUpdateUserRole:", error);
    throw new ErrorHandler(500, "Error updating user role");
  }
};

const adminDeleteAllUsers = async () => {
  try {
    console.log("Deleting all users...");
    const result = await User.destroy({
      where: {},
      truncate: true // This will reset the auto-increment counter
    });
    console.log(`Deleted ${result} users successfully!`);
    return result;
  } catch (error) {
    console.error("DB Error in adminDeleteAllUsers:", error);
    throw new ErrorHandler(500, "Error deleting all users");
  }
};

export {
  newUser,
  findUserByEmail,
  findUser,
  updateUser,
  updateRefreshToken,
  deleteUser,
  generateAccessToken,
  generateRefreshToken,
  createOTP,
  findOTP,
  updateOTPVerification,
  adminGetAllUsers,
  adminDeleteUser,
  adminDeleteAllUsers,
  adminUpdateUserRole
};
