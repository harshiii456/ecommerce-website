import { findUser } from "../modals/user.modal.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

      // console.log(req.cookies.accessToken)

    if (!token) {
      throw new ErrorHandler(401, "Unauthorized request");
    }

    const decodeToken = jwt.verify(token, process.env.ASSECC_TOKEN_SECRET);

    const user = await findUser(decodeToken?.id);

    if (!user[0]) {
      throw new ErrorHandler(401, "Invalid Access Token");
    }

    req.user = user[0];

    next();
  } catch (error) {
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
