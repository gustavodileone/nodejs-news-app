// Models & config
const userModel = require("../models/userModel");
const newsModel = require("../models/newsModel");

// Utils
const { pagination } = require("../utils/pagination");

const folderName = "index";

module.exports = {
    async indexGet(req, res, next) {
        const allNews = await newsModel.getAllNews();
        const limit = 6;

        const paginator = pagination(req.query.page, limit, allNews, "/");

        if(paginator.err) {
            res.status(paginator.status);
            return res.redirect(paginator.redirect);
        }

        const news = paginator.paginatedResults;

        // Exchange id to username.
        for(index in news) {
            const post = news[index];

            try {
                const user = await userModel.getUserById(post.news_author)
                post.news_author_name = user.user_name;
                post.news_author_slug = user.user_slug;
            } catch {
                const error = new Error("Oops... Something went wrong, please come back later.");
                error.status = 500;

                return next(error);
            }
        }

        res.status(200);
        return res.render(folderName + "/index.ejs", { news, paginator })
    },

    indexLogoutPost(req, res, next) {
        req.session.destroy(err => {
            if(err) {
                const error = new Error("An error occurred, please try again later.")
                error.status = 500;

                next(error);
            }
            
            res.status(200);
            return res.redirect("/");
        });
    }
}