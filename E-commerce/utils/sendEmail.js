const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1 - create transporter ( service that will send email : gmail , mailgun .etc).
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT, // secure === true ?  465 : 587 .
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  console.log(transporter);

  // 2 - Define email options ( from : ? , to : ? , content: ?)
  const mailOptions = {
    from: "E-shop App <eshop@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3 - send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
