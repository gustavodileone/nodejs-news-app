const emailVerificationModel = require("../models/emailVerificationModel");
const userModel = require("../models/userModel");

module.exports = {
    async deleteExpiredTokensAndAccounts() {
        await emailVerificationModel.deleteExpiredTokens();
        await userModel.deleteUnverifiedUsersWithExpiredTokens();

        return true;
    }
}