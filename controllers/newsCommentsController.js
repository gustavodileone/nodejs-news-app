// Models
const newsCommentsModel = require("../models/newsCommentsModel");
const newsModel = require("../models/newsModel");
const userModel = require("../models/userModel");

const folderName = "news";

module.exports = {
    async commentsCreatePost(req, res, next) {
        let { comments_content, author_id, news_id } = req.body;
        const { news_slug } = req.body;

        comments_content = comments_content.trim();

        if(comments_content == '') {
            res.status(400);
            return res.redirect("/news/" + news_slug);
        }

        try {
            await newsCommentsModel.createNewsComment(comments_content, author_id, news_id);

            res.status(200);
            return res.redirect("/news/" + news_slug);
        } catch(err) {
            const error = new Error("Oops... Something went wrong, please come back later.");
            error.status = 500;
            error.msg = err;

            return next(error);
        }
    },

    async commentsEditPatch(req, res, next) {
        const { comments_id } = req.params;
        const { comments_content } = req.body;

        const comment = await newsCommentsModel.getNewsCommentById(comments_id);

        if(!comment) {
            const error = new Error("Comment not found.");
            error.status = 404;

            return next(error);
        }

        if(comment.comments_author != res.locals.sessionUser.userId) {
            res.status(401);
            return res.redirect("/");
        }

        await newsCommentsModel.updateCommentById(comments_content, comments_id);

        res.status(200);

        return res.json({ success: true, comments_content: comments_content });
    },

    async commentsDelete(req, res, next) {
        const { comments_id } = req.params;
        const { news_slug } = req.body;

        const comment = await newsCommentsModel.getNewsCommentById(comments_id);

        if(!comment) {
            const error = new Error("Not found");
            error.status = 404;

            return next(error);
        }

        if(comment.comments_author != res.locals.sessionUser.userId) {
            res.status(401);
            return res.redirect("/");
        }

        try {
            await newsCommentsModel.deleteNewsCommentById(comments_id);

            res.status(200);
            return res.redirect("/news/" + news_slug);
        } catch(err) {
            const error = new Error("Oops... an error occurred, please try again later.");
            error.status = 500;
            
            return next(error);
        }
    }
}