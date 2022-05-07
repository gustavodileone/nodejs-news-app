// Dependencies
const bcrypt = require("bcrypt");

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

    indexLoginGet(req, res) {
        res.status(200);
        return res.render(folderName + "/login.ejs");
    },

    async indexLoginPost(req, res, next) {
        let { email, password } = req.body;

        email = email.trim();

        if(email === '' || password === '') {
            res.status(400);
            return res.render(folderName + "/login.ejs", { err_msg: "Please fill in all the required fields." })
        }
    
        const user = await userModel.getUserByEmail(email);

        let incorrectLogin = "Email or password are incorrect";
    
        if(!user) {
            res.status(401);
            return res.render(folderName + "/login.ejs", { err_msg: incorrectLogin });
        }
    
        bcrypt.compare(password, user.user_password, (err, success) => {
            if(err) {
                const error = new Error("An error occurred, please try again later.");
                error.status = 500;

                return next(error);
            }
    
            if(success) {
                req.session.userId = user.user_id;
                req.session.username = user.user_name;
                req.session.email = user.user_email;
                req.session.slug = user.user_slug;
                req.session.isAuth = true;
    
                res.status(200);
                return res.redirect("/");
            } else {
                res.status(401);
                return res.render(folderName + "/login.ejs", { err_msg: incorrectLogin });
            }
        })
    },

    indexRegisterPost(req, res, next) {
        let { username, email, password } = req.session;
        const { code } = req.body;

        if(code != req.session.email_code) {
            req.session.destroy();

            res.status(403);
            return res.render(folderName + "/register.ejs", { err_msg: "The code doesn't match." })
        }

        username = username.trim();
        email = email.trim();

        if(username === '' || email === '' || password === '') {
            res.status(400);
            return res.render(folderName + "/register.ejs", { err_msg: "Please fill in all the required fields." })
        }

        bcrypt.hash(password, 10, async (err, hash) => {
            if(err) {
                const error = new Error("An error occurred, please try again later.")
                error.status = 500;

                return next(error);
            }

            let slug = username.replaceAll(" ", "-");
            slug = slug.replaceAll("/", "-");
            slug = slug.replaceAll("#", "");
            slug = slug.replaceAll("?", "");
            
            let existentSlug = await userModel.getUserBySlug(slug);

            if(existentSlug != undefined) {
                let i = 1;

                while(true) {
                    const unusedSlug = `${slug}.${i}`;

                    existentSlug = await userModel.getUserBySlug(unusedSlug);
                    
                    if(existentSlug == undefined) {
                        slug = unusedSlug;
                        break;
                    }

                    i++;
                }
            }

            userModel.createUser(username, email, hash, slug)
            .then((results) => {
                req.session.userId = results.insertId;
                req.session.username = username;
                req.session.email = email;
                req.session.slug = slug;
                req.session.isAuth = true;

                res.status(201);
                return res.redirect("/");
            })
            .catch((err) => {
                if(err.code === "ER_DUP_ENTRY") {
                    res.status(400);
                    return res.render(folderName + "/register.ejs", { err_msg: "This email has already been registered." });
                }
    
                res.status(500);
                return res.render(folderName + "/register.ejs", { err_msg: "An error occurred, please try again later." });
            });
        })
    },

    indexRegisterGet(req, res) {
        res.status(200);
        return res.render(folderName + "/register.ejs");
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