import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendOTPEmail = async (email, otp) => {
  try {
    console.log("Sending OTP to:", email);
    console.log("OTP:", otp);

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: [email],
      subject: "QuickBite - Verify Your Email",
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2>QuickBite Email Verification</h2>

          <p>Your OTP is:</p>

          <h1>${otp}</h1>

          <p>This OTP will expire in 5 minutes.</p>

          <p>If you did not request this OTP, please ignore this email.</p>
        </div>
      `,
    });

    if (error) {
      console.error("❌ RESEND ERROR:", error);
      throw new Error(error.message);
    }

    console.log("✅ EMAIL SENT");
    console.log("Email ID:", data.id);

    return data;
  } catch (error) {
    console.error("❌ MAIL ERROR:", error);
    throw error;
  }
};