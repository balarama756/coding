const { Resend } = require('resend');
const OTPTemplate = require('../Template/OTP');

const Mailer = async ({ name, otp, email }) => {
    console.log('Mailer called for:', email);

    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
        const { data, error } = await resend.emails.send({
            from: 'Chitti App <onboarding@resend.dev>',
            to: process.env.NODE_ENV === 'production' ? process.env.RESEND_FROM_EMAIL : email,
            subject: 'Verify your Chitti Account',
            html: OTPTemplate({ name, otp }),
        });

        if (error) {
            console.log('Resend error:', error);
            return;
        }

        console.log('Email sent successfully:', data.id);
    } catch (error) {
        console.log('Email error:', error.message);
    }
};

module.exports = Mailer;
