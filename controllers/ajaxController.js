// Utils
const { sendEmail } = require("../utils/sendEmail");

module.exports = {
    ajaxRegisterUser(req, res) {
        const { username, email, password } = req.body;

        let code = '';

        for(let i = 0; i < 6; i++) {
            const randomNum = Math.floor(Math.random() * 10);
            
            code += randomNum;
        }

        req.session.username = username;
        req.session.email = email;
        req.session.password = password;
        req.session.email_code = code;

        const result = sendEmail(email, "Verification code", `Your code is ${code}`);

        res.status(200);
        return res.json({ result: result });
    }
}