import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(email: string, token: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    const { data, error } = await resend.emails.send({
        from: process.env.EMAIL_FROM as string,
        to: email,
        subject: "Reset Password - TrackerList",
        html: `
      <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
        <h2>Reset Password</h2>
        <p>Klik tombol di bawah buat reset password lo. Link ini berlaku 1 jam.</p>
        <a href="${resetUrl}" style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; margin: 16px 0;">
          Reset Password
        </a>
        <p style="color: #666; font-size: 14px;">Kalo lo gak minta reset password, abaikan email ini.</p>
      </div>
    `,
    });

    if (error) {
        throw new Error(`Failed to send email: ${error.message}`);
    }

    return data;
}