const db = require("./config/db");
const dbConnection = require("./config/db");

module.exports = {
    async getAllByNewsId(news_id) {
        const [ results ] = await dbConnection.execute("SELECT *, (SELECT COUNT(comments_id) FROM tb_news_comments WHERE news_id = ?) as comments_count FROM tb_news_comments WHERE news_id = ? ORDER BY comments_date DESC;", [ news_id, news_id ]);
        
        return results;
    },
    
    async getNewsCommentById(comments_id) {
        const [ results ] = await dbConnection.execute("SELECT * FROM tb_news_comments WHERE comments_id = ?", [ comments_id ]);

        return results[0];
    },

    async createNewsComment(comments_content, comments_author, news_id) {
        await dbConnection.execute("INSERT INTO tb_news_comments(comments_content, comments_author, news_id) VALUES(?, ?, ?)", [ comments_content, comments_author, news_id ]);
    
        return true;
    },

    async updateCommentById(comments_content, comments_id) {
        await dbConnection.execute("UPDATE tb_news_comments SET comments_content = ? WHERE comments_id = ?", [ comments_content, comments_id ]);

        return true;
    },

    async deleteNewsCommentById(comments_id) {
        await dbConnection.execute("DELETE FROM tb_news_comments WHERE comments_id = ?", [ comments_id ]);

        return true;
    },
    
    async deleteAllNewsCommentsByNewsId(news_id) {
        await dbConnection.execute("DELETE FROM tb_news_comments WHERE news_id = ?", [ news_id ]);

        return true;
    },

    async deleteAllNewsCommentsByAuthorId(author_id) {
        await dbConnection.execute("DELETE FROM tb_news_comments WHERE comments_author = ?", [ author_id ]);

        return true;
    }
}