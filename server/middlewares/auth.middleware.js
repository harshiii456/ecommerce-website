import { findUser } from "../modals/user.modal.sequelize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    console.log("Token from cookies:", req.cookies?.accessToken ? "exists" : "missing");
    console.log("Token from header:", req.header("Authorization") ? "exists" : "missing");
    console.log("Final token:", token ? "exists" : "missing");

    if (!token) {
      throw new ErrorHandler(401, "Unauthorized request");
    }

    console.log("ACCESS_TOKEN_SECRET for verification:", process.env.ACCESS_TOKEN_SECRET ? "exists" : "missing");

    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded token:", decodeToken);

    const user = await findUser(decodeToken?.id);

    if (!user[0]) {
      throw new ErrorHandler(401, "Invalid Access Token");
    }

    req.user = user[0];
    console.log("User authenticated:", req.user.email_id);

    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    throw new ErrorHandler(401, error?.message || "Invalid Access Token");
  }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.user_role_id === 2)) {
    next();
  } else {
    throw new ErrorHandler(403, "Access denied. Admin resources only.");
  }
});
