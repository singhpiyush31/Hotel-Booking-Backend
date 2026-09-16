const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendEmail = async (mail) => {
    try {
        const { to, subject, text } = mail;
        await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: to,
            subject: subject,
            text: text,
        });
        console.log("Email send to ", to);
    } catch (err) {
        console.error("Email failed!", err.message);
    }
};
