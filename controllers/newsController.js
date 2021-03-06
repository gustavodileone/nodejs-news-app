// Models
const newsModel = require("../models/newsModel");
const newsCommentsModel = require("../models/newsCommentsModel");
const userModel = require("../models/userModel");

const folderName = "news";

module.exports = {
    newsCreateGet(req, res) {
        res.status(200);
        return res.render(folderName + "/create.ejs");
    },

    async newsCreatePost(req, res, next) {
        let { title, slug, desc, content } = req.body;
        const sessionUserId = req.session.userId;

        title = title.trim();
        slug = slug.trim();
        desc = desc.trim();
        content = content.trim();

    
        if(!title || !slug || !desc || !content) {
            res.status(400);
            return res.render(folderName + "/create.ejs");
        }

        slug = slug.replaceAll(" ", "-");
        slug = slug.replaceAll("/", "-");
        slug = slug.replaceAll("#", "");
        slug = slug.replaceAll("?", "");

        const news = await newsModel.getNewsBySlug(slug);

        if(news !== undefined) {
            res.status(400);
            return res.render(folderName + "/create.ejs", { err_msg: "Already exists a news with this slug." });
        }

        newsModel.createNews(title, slug, desc, content, sessionUserId)
        .then(() => {
            res.status(201);
            return res.redirect("/news/" + slug);
        })
        .catch((err) => {
            const error = new Error("An error occurred, please try again later.");
            error.status = 500;

            next(error);
        })
    },

    async newsDelete(req, res, next) {
        const { id } = req.params;

        const news = await newsModel.getNewsById(id);

        if(!news) {
            const error = new Error("News not found");
            error.status = 404;

            return next(error);
        }

        if(news.news_author != res.locals.sessionUser.userId) {
            res.status(401);
            return res.redirect("/");
        }

        // Delete all comments in this news
        await newsCommentsModel.deleteAllNewsCommentsByNewsId(id);

        // Delete news
        newsModel.deleteNewsById(id);

        res.status(200);
        return res.redirect("/");
    },

    async newsEditGet(req, res, next) {
        const { slug } = req.params;

        const news = await newsModel.getNewsBySlug(slug);

        if(!news) {
            const error = new Error("News not found");
            error.status = 404;

            return next(error);
        }

        res.status(200)
        return res.render(folderName + "/edit.ejs", { news });
    },

    async newsEditPatch(req, res, next) {
        const id = parseInt(req.params.id);
        let { title, slug, desc, content } = req.body;

        const news = await newsModel.getNewsById(id);

        if(!news) {
            const error = new Error("News not found");
            error.status = 404;

            return next(error);
        }

        if(news.news_author != res.locals.sessionUser.userId) {
            res.status(401);
            return res.redirect("/");
        }

        title = title.trim();
        slug = slug.trim();
        desc = desc.trim();
        content = content.trim();

        if(title === '' || slug === '' || desc === '' || content === '') {
            req.flash("err_msg", "Please fill in all the required fields");
            res.status(400);
            return res.redirect("/news/edit/" + news.news_slug);
        }

        slug = slug.replaceAll(" ", "-");
        slug = slug.replaceAll("/", "-");
        slug = slug.replaceAll("#", "");
        slug = slug.replaceAll("?", "");

        const newsSlug = await newsModel.getNewsBySlug(slug);

        if(newsSlug !== undefined && newsSlug.news_id !== id) {
            req.flash("err_msg", "Already exists a news with this slug.");

            res.status(400);
            return res.redirect("/news/edit/" + news.news_slug);
        }

        newsModel.updateNewsById(title, slug, desc, content, id);

        res.status(200);
        return res.redirect("/news/" + slug);
    },

    async newsSlugGet(req, res, next) {
        const { slug } = req.params;
    
        const news = await newsModel.getNewsBySlug(slug);

        if(!news) {
            const error = new Error("News not found");
            error.status = 404;

            return next(error);
        }

        const user = await userModel.getUserById(news.news_author);

        if(!user) {
            const error = new Error("User not found");
            error.status = 404;

            return next(error);
        }
    
        news.news_author = user.user_name;
        news.news_author_slug = user.user_slug;

        // Comments:
        let allComments = await newsCommentsModel.getAllByNewsId(news.news_id);

        if(allComments.length != 0) {
            // Exchange id to username.
            for(index in allComments) {
                const comment = allComments[index];
    
                try {
                    const user = await userModel.getUserById(comment.comments_author);
                    comment.comments_author_username = user.user_name;
                    comment.comments_author_slug = user.user_slug;
                } catch {
                    const error = new Error("Oops... Something went wrong, please come back later.");
                    error.status = 500;
    
                    return next(error);
                }
            }
        } else {
            allComments = false;
        }

        res.status(200);
        return res.render(folderName + "/show.ejs", { news, allComments });
    }
}