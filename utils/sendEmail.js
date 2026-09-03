import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendEmail = async (to, subject, html) => {
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: subject || "Lumminous Thoughts Verification Code",
    html,
  });
};

export const otpEmailTemplate = ({ title, otp, subtitle }) => {
  return `
  <div style="font-family: 'Georgia', serif; max-width: 500px; margin: auto; background:#0b0b0b; color:#f5e6c8; border-radius:14px; overflow:hidden; border:1px solid #caa24a;">
    <div style="padding:30px; text-align:center;">
      <h2 style="letter-spacing:4px; color:#caa24a; margin-bottom:4px;">LUMORA</h2>
      <p style="font-size:13px; color:#cfc4a8;">${subtitle || "Continue your journey of mindfulness"}</p>
      <h3 style="margin-top:20px;">${title}</h3>
      <div style="font-size:32px; letter-spacing:10px; font-weight:bold; color:#caa24a; margin:20px 0;">${otp}</div>
      <p style="font-size:13px; color:#cfc4a8;">This code will expire in 5 minutes. If you did not request this, please ignore this email.</p>
    </div>
  </div>
  `;
};
