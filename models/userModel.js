const dbConnection = require("./config/db");

module.exports = {
    async getUserByEmail(email) {
        const [results] = await dbConnection.execute("SELECT * FROM tb_users WHERE user_email = ?", [email]);
        
        return results[0];
    },

    async getUserById(id) {
        const [ results ] = await dbConnection.execute("SELECT * FROM tb_users WHERE user_id = ?", [ id ]);

        return results[0];
    },

    async getUserBySlug(slug) {
        const [ results ] = await dbConnection.execute("SELECT * FROM tb_users WHERE user_slug = ?", [ slug ]);

        return results[0];
    },

    async createUser(username, email, hash, slug) {
        const [ results ] = await dbConnection.execute("INSERT INTO tb_users (user_name, user_email, user_password, user_slug) VALUES (?, ?, ?, ?)", [ username, email, hash, slug ]);

        return results;
    },

    async updateUser(username, biography, slug, id) {
        const [ results ] = await dbConnection.execute("UPDATE tb_users SET user_name = ?, user_biography = ?, user_slug = ? WHERE user_id = ?", [ username, biography, slug, id ]);

        return results;
    },
    
    async updateUserPassword(hash, id) {
        const [ results ] = await dbConnection.execute("UPDATE tb_users SET user_password = ? WHERE user_id = ?", [ hash, id ]);
    
        return results;
    },
    
    async deleteUserById(id) {
        const [ results ] = await dbConnection.execute("DELETE FROM tb_users WHERE user_id = ?", [ id ]);

        return results;
    },
};