import nodemailer from "nodemailer";

export const sendEmail = async (emailData) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: process.env.userEmail,
      pass: process.env.userPass,
    },
  });

  try {
    const info = await transporter.sendMail(emailData);
    console.log(`Message sent: ${info.response}`);
  } catch (err) {
    console.log(`Problem sending email: ${err}`);
  }
};
