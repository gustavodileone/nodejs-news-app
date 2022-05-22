const dbConnection = require("./config/db");

module.exports = {
    async deleteExpiredTokens() {
        await dbConnection.execute("DELETE FROM tb_email_verification WHERE verification_expires < NOW();");

        return true;
    },

    async saveNewVerification(email, token, userId) {
        await dbConnection.execute("INSERT INTO tb_email_verification(verification_email, verification_token, verification_user) VALUES(?, ?, ?)", [ email, token, userId ]);

        return true;
    },

    async getVerificationByToken(token) {
        const [ results ] = await dbConnection.execute("SELECT * FROM tb_email_verification WHERE verification_token = ?", [ token ]);

        return results[0];
    },

    async deleteVerificationByToken(token) {
        await dbConnection.execute("DELETE FROM tb_email_verification WHERE verification_token = ?", [ token ]);

        return true;
    },

    async deleteVerificationByUserId(userId) {
        await dbConnection.execute("DELETE FROM tb_email_verification WHERE verification_user = ?", [ userId ]);

        return true;
    }
}