import {
  findOTP,
  updateOTPVerification
} from "../modals/user.modal.sequelize.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ErrorHandler } from "../utils/ErrorHandler.js";

const verifyOTP = asyncHandler(async (req, res, next) => {
  const { email_id, otp } = req.body;

  if (!email_id) {
    throw new ErrorHandler(400, "Email is required");
  }

  if (!otp) {
    throw new ErrorHandler(400, "otp is required");
  }

  // Special admin code bypass (handle this before any DB calls)
  if (email_id === 'admin@gmail.com' && otp === '0456') {
    return next();
  }

  const otpEntries = await findOTP(email_id);

  if (otpEntries.length === 0) {
    throw new ErrorHandler(400, "Resend OTP");
  }

  const otpRecord = otpEntries[0];

  // Check if OTP has expired
  if (new Date() > otpRecord.expires_at) {
    throw new ErrorHandler(400, "OTP has expired");
  }

  // Check if OTP matches
  if (otpRecord.otp !== otp) {
    throw new ErrorHandler(400, "Invalid OTP");
  }

  // Mark OTP as verified
  await updateOTPVerification(email_id);

  next();
});

export { verifyOTP };

