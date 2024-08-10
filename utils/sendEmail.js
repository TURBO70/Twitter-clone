const nodemailer = require("nodemailer");
const customError = require("../utils/customError");

const sendEmail = async (options) => {
  console.log(options);
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true, // or false depending on the port
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `support <support @wefuhwef.com>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new customError("Error sending email", 500);
  }
};

module.exports = sendEmail;