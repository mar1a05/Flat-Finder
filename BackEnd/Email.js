const nodemailer = require("nodemailer");

const sendEmail = async(info) => {
    const tranporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    })

    const emailOptions = {
        from: 'Products <support@products.com>',
        to: info.email,
        subject: info.subject,
        text: info.message
    }

    await tranporter.sendMail(emailOptions);
}

module.exports = sendEmail;