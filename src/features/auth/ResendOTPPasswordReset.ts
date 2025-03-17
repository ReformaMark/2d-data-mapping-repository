import Resend from "@auth/core/providers/resend";
import { Resend as ResendAPI } from "resend";
import { alphabet, generateRandomString } from "oslo/crypto";

export const ResendOTPPasswordReset = Resend({
    id: "resend-otp",
    name: "Resend",
    apiKey: process.env.RESEND_API_KEY,
    async generateVerificationToken() {
        return generateRandomString(8, alphabet("0-9"));
    },
    async sendVerificationRequest({ identifier: email, provider, token }) {
        if (!provider.apiKey) {
            throw new Error("Resend API key is not configured");
        }

        try {
            const resend = new ResendAPI(provider.apiKey);
            await resend.emails.send({
                from: "Agrimapper <noreply@agrimapper.online>",
                to: [email],
                subject: "Reset Your Password - Agrimapper",
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
                        <p style="color: #666; text-align: center;">We received a request to reset your password for Agrimapper.</p>
                        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0;">
                            <p style="font-size: 24px; color: #333;">Your password reset code is:</p>
                            <h2 style="color: #93c47d; font-size: 32px; letter-spacing: 5px;">${token}</h2>
                        </div>
                        <p style="color: #666; text-align: center;">Enter this code to reset your password. If you didn't request this, you can safely ignore this email.</p>
                    </div>
                `
            })
        } catch (error) {
            console.error("Failed to send password reset email:", error)
            throw error;
        }
    }
})