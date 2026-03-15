import {
  findUser,
  generateAccessToken,
  generateRefreshToken,
  findUserByEmail,
  newUser,
  saveVerificationCode,
  updateRefreshToken,
  verificationAttempt,
  getAllUsers,
  deleteUser,
  updatePasswordByEmail,
  updateResetToken,
  updateUserRole
} from "../modals/user.modal.js";

import { ApiResponse } from "../utils/ApiResponse.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { otpEmailTemplate } from "../utils/EmailTemplate.js";
import { sendEmail } from "../utils/sendEmail.js";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateVerificationCode = async () => {
  const code = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, 0);

  return code.toString();
};

const sendVerificationCode = async (email_id, verificationCode) => {
  try {
    const message = otpEmailTemplate(verificationCode);

    const mailResponse = await sendEmail({
      email_id,
      subject: "Verification Code",
      message,
    });

    if (!mailResponse?.response) {
      throw new ErrorHandler(500, "Failed to send Email");
    }

    return;
  } catch (error) {
    throw new ErrorHandler(500, "Failed to send verification code");
  }
};

const generateAccessAndRefreshTokens = async (user_id, role) => {
  try {
    const accessToken = generateAccessToken(user_id, role);
    const refreshToken = generateRefreshToken(user_id, role);

    await updateRefreshToken({ refreshToken, user_id });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ErrorHandler(
      401,
      "Something went wrong while generating refresh and access token"
    );
  }
};

const userStatus = asyncHandler(async (req, res, next) => {
  const { email_id } = req.body;

  if (!email_id) {
    throw new ErrorHandler(400, "Email is required");
  }

  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  const result = pattern.test(email_id);

  if (!result) {
    console.log("Invalid Email Received:", email_id);
    throw new ErrorHandler(400, "Email is Invalid");
  }

  const user = await findUserByEmail(email_id);

  let userStatus = "NOT_FOUND";

  if (user[0]) {
    userStatus = "VERIFIED";
  }

  res.status(200).json(
    new ApiResponse(
      200,
      {
        userStatus: userStatus,
      },
      userStatus
    )
  );
});

const sendOTP = asyncHandler(async (req, res, next) => {
  const { email_id } = req.body;

  if (!email_id) {
    throw new ErrorHandler(400, "Email is required");
  }

  const verificationCode = await generateVerificationCode();

  const verfication = await saveVerificationCode({
    email_id,
    verificationCode,
  });

  if (!verfication?.insertId) {
    throw new ErrorHandler(
      500,
      "Something went wrong while sending otp ,please try again."
    );
  }

  await sendVerificationCode(email_id, verificationCode);

  res.status(200).json({
    success: true,
    message: "OTP Sent TO Your Email Address.",
  });
});

const createUser = asyncHandler(async (req, res, next) => {
  const { email_id, password } = req.body;

  if (!email_id) {
    throw new ErrorHandler(400, "Email is required");
  }

  const userExist = await findUserByEmail(email_id);

  if (userExist?.length > 0) {
    throw new ErrorHandler(
      400,
      "You are already register with us,please sign in"
    );
  }

  let hashedPassword = null;
  if (password) {
    const salt = await bcrypt.genSalt(10);
    hashedPassword = await bcrypt.hash(password, salt);
  }

  const userRegisterd = await newUser({ email_id, password: hashedPassword });

  if (!userRegisterd?.insertId) {
    throw new ErrorHandler(500, "cant register,please try again.");
  }

  const user = await findUser(userRegisterd?.insertId);

  if (!user[0]) {
    throw new ErrorHandler(
      500,
      "Something went wrong while registering process,please try again."
    );
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user[0].user_id,
    user[0].role || 'customer'
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax"
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: (() => { const { password, ...rest } = user[0]; return rest; })(),
          accessToken,
          refreshToken,
        },
        "Account Created"
      )
    );
});

const loginUser = asyncHandler(async (req, res, next) => {
  const { email_id, password } = req.body;

  if (!email_id) {
    throw new ErrorHandler(400, "Email is required");
  }

  let user = await findUserByEmail(email_id);

  // Special handling for admin login
  if (email_id === 'harshita@gmail.com') {
    if (!user[0]) {
      // Create admin user if not exists
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin_default_pass', salt); // Dummy password as OTP is used
      const userRegisterd = await newUser({ email_id, password: hashedPassword });
      if (userRegisterd?.insertId) {
        await updateUserRole(userRegisterd.insertId, 'admin');
        const newUserDetails = await findUser(userRegisterd.insertId);
        user = newUserDetails;
      } else {
        throw new ErrorHandler(500, "Failed to create admin user");
      }
    } else if (user[0].role !== 'admin') {
      // Update existing user to admin role if they are the special admin email
      await updateUserRole(user[0].user_id, 'admin');
      const updatedUserDetails = await findUserByEmail(email_id);
      user = updatedUserDetails;
    }
  }

  if (!user[0]) {
    throw new ErrorHandler(400, "User not found");
  }

  // Password check is skipped because OTP is verified by verifyOTP middleware
  /*
  const isMatch = await bcrypt.compare(password, user[0].password || "");
  
  if (!isMatch) {
    throw new ErrorHandler(400, "Invalid Email or Password");
  }
  */

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user[0].user_id,
    user[0].role || 'customer'
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax"
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: (() => { const { password, ...rest } = user[0]; return rest; })(),
          accessToken,
          refreshToken,
        },
        "Logged In Successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res, next) => {
  const refreshToken = null;

  const user_id = req.user.user_id;

  await updateRefreshToken({ refreshToken, user_id });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax"
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"));
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ErrorHandler(401, "unauthorized request");
  }

  try {
    const decodeToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await findUser(decodeToken?.id);

    if (!user[0]) {
      throw new ErrorHandler(401, "Invalid Refresh Token");
    }

    if (incomingRefreshToken !== user[0]?.refresh_token) {
      throw new ErrorHandler(401, "Refresh Token is expired or used");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
      user[0].user_id,
      user[0].role || 'customer'
    );

    res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json(
        new ApiResponse(
          200,
          {
            accessToken,
            refreshToken,
          },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ErrorHandler(401, error?.message || "Invalid Refresh token");
  }
});

const getCurrentUser = asyncHandler(async (req, res, next) => {
  const user = req.user;

  res.status(200).json(new ApiResponse(200, user, "loged in user"));
});

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email_id } = req.body;

  if (!email_id) {
    throw new ErrorHandler(400, "Email is required");
  }

  const user = await findUserByEmail(email_id);

  if (!user[0]) {
    throw new ErrorHandler(404, "User not found");
  }

  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  const resetExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await updateResetToken(email_id, resetToken, resetExpire);

  // In a real app, send actual email. For now, we logic it out.
  // We can use sendEmail if smtp is configured.
  /*
  const message = `Your password reset token is: ${resetToken}`;
  await sendEmail({ email_id, subject: "Password Reset Token", message });
  */

  res.status(200).json(new ApiResponse(200, { resetToken }, "Reset token sent (mocked)"));
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const { email_id, resetToken, newPassword } = req.body;

  if (!email_id || !resetToken || !newPassword) {
    throw new ErrorHandler(400, "All fields are required");
  }

  const user = await findUserByEmail(email_id);

  if (!user[0]) {
    throw new ErrorHandler(404, "User not found");
  }

  if (user[0].reset_password_token !== resetToken) {
    throw new ErrorHandler(400, "Invalid reset token");
  }

  if (new Date(user[0].reset_password_expire).getTime() < Date.now()) {
    throw new ErrorHandler(400, "Reset token expired");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  await updatePasswordByEmail(email_id, hashedPassword);
  await updateResetToken(email_id, null, null); // clear token

  res.status(200).json(new ApiResponse(200, {}, "Password reset successful"));
});

// Admin Controllers
const adminGetAllUsers = asyncHandler(async (req, res, next) => {
  const users = await getAllUsers();
  res.status(200).json(new ApiResponse(200, users, "All users fetched successfully"));
});

const adminDeleteUser = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  await deleteUser(id);
  res.status(200).json(new ApiResponse(200, {}, "User deleted successfully"));
});

const adminUpdateUserRole = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role || !['admin', 'customer'].includes(role)) {
    throw new ErrorHandler(400, "Valid role (admin/customer) is required");
  }

  await updateUserRole(id, role);
  res.status(200).json(new ApiResponse(200, {}, "User role updated successfully"));
});

export {
  userStatus,
  sendOTP,
  createUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  forgotPassword,
  resetPassword,
  adminGetAllUsers,
  adminDeleteUser,
  adminUpdateUserRole
};
