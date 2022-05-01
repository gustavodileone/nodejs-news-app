const dbConnection = require("./config/db");

module.exports = {
    async createNews(title, slug, description, content, author) {
        const [ results, fields ] = await dbConnection.execute("INSERT INTO tb_news(news_title, news_slug, news_desc, news_content, news_author) VALUES(?, ?, ?, ?, ?)", [ title, slug, description, content, author ]);
    
        return {
            results,
            fields
        };
    },

    async getAllNews() {
        const [ results ] = await dbConnection.execute("SELECT * FROM tb_news ORDER BY news_date DESC");

        return results;
    },

    async getNewsById(id) {
        const [ results ] = await dbConnection.execute("SELECT * FROM tb_news WHERE news_id = ?", [ id ]);

        return results[0];
    },

    async getNewsBySlug(slug) {
        const [ results ] = await dbConnection.execute("SELECT * FROM tb_news WHERE news_slug = ?", [ slug ]);

        return results[0];
    },

    async getNewsByUserId(user_id) {
        const [ results ] = await dbConnection.execute("SELECT * FROM tb_news WHERE news_author = ?", [ user_id ]);

        return results;
    },

    async updateNewsById(title, slug, desc, content, id) {
        const [ results ] = await dbConnection.execute("UPDATE tb_news SET news_title = ?, news_slug = ?, news_desc = ?, news_content = ? WHERE news_id = ?", [ title, slug, desc, content, id ]);

        return results[0];
    },

    async deleteNewsById(id) {
        const [ results ] = await dbConnection.execute("DELETE FROM tb_news WHERE news_id = ?", [ id ]);
    
        return results;
    },
    
    async deleteNewsByUserId(user_id) {
        const [ results ] = await dbConnection.execute("DELETE FROM tb_news WHERE news_author = ?", [ user_id ]);

        return results;
    }
}