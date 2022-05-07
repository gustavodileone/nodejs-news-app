const nodemailer = require("nodemailer");

module.exports = {
    async sendEmail(user_email, subject, message) {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: process.env.EMAIL_PORT,
                secure: true,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                }
            })

            await transporter.sendMail({
                from: `"Nodejs-news-app"`,
                to: user_email,
                subject: subject,
                text: message
            });

            return true;
        } catch(err) {
            return false;
        }
    }
}

