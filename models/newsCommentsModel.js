const db = require("./config/db");
const dbConnection = require("./config/db");

module.exports = {
    async getAllByNewsId(news_id) {
        const [ results ] = await dbConnection.execute("SELECT *, (SELECT COUNT(comments_id) FROM tb_news_comments WHERE news_id = ?) as comments_count FROM tb_news_comments WHERE news_id = ? ORDER BY comments_date DESC;", [ news_id, news_id ]);
        
        console.log(results);

        return results;
    },

    async createNewsComment(comments_content, comments_author, news_id) {
        await dbConnection.execute("INSERT INTO tb_news_comments(comments_content, comments_author, news_id) VALUES(?, ?, ?)", [ comments_content, comments_author, news_id ]);
    
        return true;
    },

    async deleteNewsCommentById(comments_id) {
        await dbConnection.execute("DELETE FROM tb_news_comments WHERE comments_id = ?", [ comments_id ]);

        return true;
    }
}