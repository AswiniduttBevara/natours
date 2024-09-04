const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    //transporter
    const transporter = nodemailer.createTransport({
        host:process.env.MAILHOST,
        port:process.env.MAILPORT,
        auth:{
            user:process.env.MAILUSERNAME,
            pass:process.env.MAILPASSWORD
        }
    })
    //mail options
    const mailOptions = {
        from:'RadhaMadhava <RadhaMadhava.io>',
        to:options.email,
        subject:options.subject,
        text:options.message,
    }

    //send email
    await transporter.sendMail(mailOptions);
}

module.exports = sendEmail;