const nodemailer = require("nodemailer");
const sendEmail = async (options)=>{

    const transporter = nodemailer.createTransport({
        host:process.env.SMPT_HOST,
        port:process.env.SMPT_PORT,
        service:process.env.SMPT_SERVICE,
        // host:"smtp.gmail.com",
        // port:"465",
        // service:"gmail",
        //here smtp means simple mail transport protocol
        auth:{
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD
            // user: "nodemailercheckingvaibhav@gmail.com",
            // pass: "ieqwenutnpdrrddq"
        },
        tls: {
            rejectUnauthorized: false
          }

    })

    const mailOptions = {
        // from: process.env.SMPT_MAIL,
        from: "nodemailercheckingvaibhav@gmail.com",
        to:options.email,
        subject: options.subject,
        text: options.message,
    }

    await transporter.sendMail(mailOptions);
    //here sendMail is the nodemailer function to give mail options

}

module.exports = sendEmail;