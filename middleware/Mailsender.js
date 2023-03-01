const nodemailer = require("nodemailer");

exports.mailer = async (req, res) => {
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing

  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.EMAIL_SECRATE_WEB, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: process.env.EMAIL, // sender address
    to: req.email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: `This mail is from Ayush.`, // plain text body
    html: `
            <h3>Hello,</h3>
            <h3>You can reset your password by clicking the link below.</h3>
            <a 
                href="https://live-weather-forecasting.netlify.app/reset/${req.token}" 
                style="
                    border: 1px solid black; 
                    padding: 5px; 
                    border-radius: 5px; 
                    background: rgb(33, 47, 61); 
                    color: white; 
                    text-align:center; 
                    text-decoration: none;"
            >
                Reset Password
            </a>
            <h4>Note: The link is valide for 2 min only.</h4>
        `,
  });

  return info;
};
