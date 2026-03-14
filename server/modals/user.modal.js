import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { ErrorHandler } from "../utils/ErrorHandler.js";
import { databaseInstance } from "../database/database.js";

const newUser = async (userData) => {
  const query = "INSERT INTO user_master (user_role_id, email_id, password, user_status) VALUES (1, ?, ?, 0)";
  try {
    const [res] = await databaseInstance.query(query, [userData.email_id, userData.password]);
    return res;
  } catch (error) {
    console.error("DB Error in newUser:", error);
    throw new ErrorHandler(500, "Error creating user");
  }
};

const findUserByEmail = async (userData) => {
  const query = "SELECT user_id,user_first_name,user_last_name,email_id,password,user_role_id,mobile_number,reset_password_token,reset_password_expire FROM user_master WHERE email_id=?";
  try {
    const [res] = await databaseInstance.query(query, [userData]);
    return res;
  } catch (error) {
    console.error("DB Error in findUserByEmail:", error);
    throw new ErrorHandler(500, "Error finding user by email");
  }
};

const findUser = async (userData) => {
  const query = "SELECT user_id,user_first_name,user_last_name,email_id,mobile_number,user_role_id,refresh_token,reset_password_token,reset_password_expire FROM user_master WHERE user_id=?";
  try {
    const [res] = await databaseInstance.query(query, [userData]);
    return res;
  } catch (error) {
    console.error("DB Error in findUser:", error);
    throw new ErrorHandler(500, "Error finding user");
  }
};

const verificationAttempt = async (userData) => {
  const query = `SELECT SUM(verification_attempt) as count FROM (
SELECT otp_id, email_id,otp_code, otp_code_expires, created_at, verification_attempt FROM otp_verification WHERE email_id= ?)a GROUP BY a.email_id`;
  try {
    const [res] = await databaseInstance.query(query, [userData]);
    return res;
  } catch (error) {
    console.error("DB Error in verificationAttempt:", error);
    throw new ErrorHandler(500, "Error checking verification attempts");
  }
};

const updateVerificationAttempt = async (userData) => {
  const query = "UPDATE otp_verification SET verification_attempt=verification_attempt + 1 WHERE otp_id=?";
  try {
    const [res] = await databaseInstance.query(query, [userData]);
    return res;
  } catch (error) {
    console.error("DB Error in updateVerificationAttempt:", error);
    throw new ErrorHandler(500, "Error updating verification attempt");
  }
};

const saveVerificationCode = async (userData) => {
  const { email_id, verificationCode } = userData;
  const verficationCodeExpire = new Date(Date.now() + 5 * 60 * 1000);
  const query = "INSERT INTO otp_verification SET email_id=?,otp_code=?,otp_code_expires=?,verification_attempt=0";
  try {
    const [res] = await databaseInstance.query(query, [email_id, verificationCode, verficationCodeExpire]);
    return res;
  } catch (error) {
    console.error("DB Error in saveVerificationCode:", error);
    throw new ErrorHandler(500, "Error saving verification code");
  }
};

const getVerificaionCode = async (userData) => {
  const query = "SELECT otp_id,email_id,otp_code,otp_code_expires FROM otp_verification WHERE email_id=? ORDER BY otp_code_expires DESC";
  try {
    const [res] = await databaseInstance.query(query, [userData]);
    return res;
  } catch (error) {
    console.error("DB Error in getVerificaionCode:", error);
    throw new ErrorHandler(500, "Error getting verification code");
  }
};

const deleteVerificaionUsers = async (userData) => {
  const query = "DELETE FROM otp_verification WHERE email_id=?";
  try {
    const [res] = await databaseInstance.query(query, [userData]);
    return res;
  } catch (error) {
    console.error("DB Error in deleteVerificaionUsers:", error);
    throw new ErrorHandler(500, "Error deleting verification entry");
  }
};

const updateRefreshToken = async (userData) => {
  const { refreshToken, user_id } = userData;
  const query = "UPDATE user_master SET refresh_token=? WHERE user_id=?";
  try {
    const [res] = await databaseInstance.query(query, [refreshToken, user_id]);
    return res;
  } catch (error) {
    console.error("DB Error in updateRefreshToken:", error);
    throw new ErrorHandler(500, "Error updating refresh token");
  }
};

const updatePasswordByEmail = async (email_id, hashedPassword) => {
  const query = "UPDATE user_master SET password=? WHERE email_id=?";
  try {
    const [res] = await databaseInstance.query(query, [hashedPassword, email_id]);
    return res;
  } catch (error) {
    console.error("DB Error in updatePasswordByEmail:", error);
    throw new ErrorHandler(500, "Error updating password");
  }
};

const updateResetToken = async (email_id, token, expires) => {
  const query = "UPDATE user_master SET reset_password_token=?, reset_password_expire=? WHERE email_id=?";
  try {
    const [res] = await databaseInstance.query(query, [token, expires, email_id]);
    return res;
  } catch (error) {
    console.error("DB Error in updateResetToken:", error);
    throw new ErrorHandler(500, "Error updating reset token");
  }
};

const getAllUsers = async () => {
  const query = "SELECT user_id, user_first_name, user_last_name, email_id, mobile_number, user_role_id FROM user_master";
  try {
    const [res] = await databaseInstance.query(query);
    return res;
  } catch (error) {
    console.error("DB Error in getAllUsers:", error);
    throw new ErrorHandler(500, "Error fetching users");
  }
};

const deleteUser = async (user_id) => {
  const query = "DELETE FROM user_master WHERE user_id = ?";
  try {
    const [res] = await databaseInstance.query(query, [user_id]);
    return res;
  } catch (error) {
    console.error("DB Error in deleteUser:", error);
    throw new ErrorHandler(500, "Error deleting user");
  }
};

const comparePassword = async function (enteredPassword, dbpassword) {
  return await bcrypt.compare(enteredPassword, dbpassword);
};

const generateAccessToken = function (user_id) {
  return jwt.sign({ id: user_id }, process.env.ASSECC_TOKEN_SECRET, {
    expiresIn: process.env.ASSECC_TOKEN_EXPIRE,
  });
};

const generateRefreshToken = function (user_id) {
  return jwt.sign({ id: user_id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
  });
};

export {
  newUser,
  findUserByEmail,
  findUser,
  verificationAttempt,
  updateVerificationAttempt,
  saveVerificationCode,
  getVerificaionCode,
  deleteVerificaionUsers,
  generateAccessToken,
  generateRefreshToken,
  updateRefreshToken,
  updatePasswordByEmail,
  updateResetToken,
  getAllUsers,
  deleteUser
};

