const nodemailer = require('nodemailer');
const OTPTemplate = require('../Template/OTP');

const Mailer = async ({ name, otp, email }) => {
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_APP_PASSWORD,
        },
    });

    const mailOptions = {
        from: process.env.NODEMAILER_USER,
        to: email,
        subject: 'Verify your Chitti Account',
        html: OTPTemplate({ name, otp }),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.messageId);
    } catch (error) {
        console.log('Error sending email:', error);
        throw new Error('Error sending mail');
    }
};

module.exports = Mailer;
