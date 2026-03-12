const nodemailer = require('nodemailer');
const OTPTemplate = require('../Template/OTP');

const Mailer = async ({ name, otp, email }) => {
    console.log('Mailer called for:', email);
    console.log('Using email account:', process.env.NODEMAILER_USER);
    console.log('App password set:', !!process.env.NODEMAILER_APP_PASSWORD);

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: process.env.NODEMAILER_USER,
            pass: process.env.NODEMAILER_APP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false,
        },
    });

    const mailOptions = {
        from: `"Chitti App" <${process.env.NODEMAILER_USER}>`,
        to: email,
        subject: 'Verify your Chitti Account',
        html: OTPTemplate({ name, otp }),
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', info.messageId);
        console.log('Accepted:', info.accepted);
    } catch (error) {
        console.log('Email error code:', error.code);
        console.log('Email error message:', error.message);
        console.log('Full error:', JSON.stringify(error, null, 2));
        // Don't throw - just log so server doesn't crash
    }
};

module.exports = Mailer;
