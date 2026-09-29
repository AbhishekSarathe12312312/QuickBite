import mongoose from "mongoose";

const forgotPasswordOTPSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },

    otpHash: {
      type: String,
      required: true,
    },

    otpVerified: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    attempts: {
      type: Number,
      default: 0,
    },

    resetTokenHash: {
      type: String,
      default: "",
    },

    resetTokenExpiresAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const ForgotPasswordOTP = mongoose.model(
  "ForgotPasswordOTP",
  forgotPasswordOTPSchema,
);

export default ForgotPasswordOTP;
