import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmationEmail({
  to, name, waitlistName, confirmUrl, subject,
}: {
  to: string; name: string; waitlistName: string; confirmUrl: string; subject: string;
}) {
  const { error } = await resend.emails.send({
    from: "Waitlyst <noreply@waitlyst.co>",
    to,
    subject,
    html: `
      <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;">
        <h2>Hi ${name} 👋</h2>
        <p>You signed up for <strong>${waitlistName}</strong>. Click below to confirm your spot.</p>
        <a href="${confirmUrl}" style="display:inline-block;background:#d4f57a;color:#1a2a00;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;margin:16px 0;">
          Confirm my spot →
        </a>
        <p style="color:#999;font-size:12px;">Didn't sign up? Ignore this email.</p>
      </div>
    `,
  });
  if (error) console.error("[email]", error);
}
