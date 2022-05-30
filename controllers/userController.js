// Dependencies
const bcrypt = require("bcrypt");

// Models
const userModel = require("../models/userModel");
const newsModel = require("../models/newsModel");

// Utils
const { pagination } = require("../utils/pagination");
const { existentUserSlug } = require("../utils/existentUserSlug");
const newsCommentsModel = require("../models/newsCommentsModel");

const folderName = "user";

module.exports = {
    async indexGet(req, res, next) {
        const { slug } = req.params;

        const user = await userModel.getUserBySlug(slug);

        if(!user) {
            const error = new Error("User not found.");
            error.status = 404;

            return next(error);
        }

        let allNews = await newsModel.getNewsByUserId(user.user_id);

        let paginator;
        let news;

        if(allNews[0] == undefined) {
            paginator = false;
            news = false;
        } else {
            paginator = pagination(req.query.page, 6, allNews, `/user/${user.user_slug}`);
            news = paginator.paginatedResults;
        }

        res.status(200);
        return res.render(folderName + "/show.ejs", { user, news, paginator });
    },

    async userEditGet(req, res, next) {
        const { slug } = req.params;

        const user = await userModel.getUserBySlug(slug);

        if(!user) {
            const error = new Error("User not found.");
            error.status = 404;

            return next(error);
        }

        if(res.locals.sessionUser.userId !== user.user_id) {
            res.status(401);
            return res.redirect("/");
        }

        res.status(200);
        res.render(folderName + "/edit.ejs", { user });
    },

    async userEditPatch(req, res, next) {
        const { id } = req.params;
        let { username, biography } = req.body;
        
        if(res.locals.sessionUser.userId != id) {
            res.status(401);
            return res.redirect("/");
        }

        username = username.trim();

        if(username === '') {
            req.flash("err_msg", "Your username cannot be blank.");

            res.status(400);
            return res.redirect("/user/edit/" + user.user_slug);
        }

        const user = await userModel.getUserById(id);

        if(!user) {
            const error = new Error("User not found.");
            error.status = 404;

            return next(error);
        }

        let slug = username.replaceAll(" ", "-");
        slug = slug.replaceAll("/", "-");
        slug = slug.replaceAll("#", "");
        slug = slug.replaceAll("?", "");

        slug = await existentUserSlug(slug); // handle if slug already exists

        userModel.updateUser(username, biography, slug, id);

        req.session.username = username;
        req.session.slug = slug;
        req.session.isAuth = true;
        
        res.status(200);
        return res.redirect("/user/" + slug);
    },

    async userEditPasswordGet(req, res, next) {
        const { slug } = req.params;

        const user = await userModel.getUserBySlug(slug);

        if(!user) {
            const error = new Error("User not found.");
            error.status = 404;

            return next(error);
        }

        if(res.locals.sessionUser.userId != user.user_id) {
            res.status(401);
            return res.redirect("/");
        }

        res.status(200);
        return res.render(folderName + "/edit-password.ejs", { user });
    },

    async userEditPasswordPatch(req, res, next) {
        const { id } = req.params;
        const { current_password, new_password, repeat_new_password } = req.body;

        if(res.locals.sessionUser.userId != id) {
            res.status(401);
            return res.redirect("/");
        }
        
        if(current_password == '' || new_password == '' || repeat_new_password == '') {
            req.flash("err_msg", "Please fill in all the required fields.");

            res.status(400);
            return res.redirect("/user/edit-password/" + res.locals.sessionUser.slug);
        }

        if(new_password != repeat_new_password) {
            req.flash("err_msg", "The new password fields don't match.");

            res.status(200);
            return res.redirect("/user/edit-password/" + res.locals.sessionUser.slug);
        }
        
        const user = await userModel.getUserById(id);

        if(!user) {
            const error = new Error("User not found.");
            error.status = 404;

            return next(error);
        }

        bcrypt.compare(current_password, user.user_password, (err, success) => {
            if(err) {
                const error = new Error("An error occurred, please try again later.");
                error.status = 500;

                return next(error);
            }

            if(success) {
                bcrypt.hash(new_password, 10, async (err_hash, hash) => {
                    if(err_hash) {
                        const error = new Error("An error occurred, please try again later.");
                        error.status = 500;

                        return next(error);
                    }

                    userModel.updateUserPassword(hash, user.user_id);
                    
                    res.status(200);
                    return res.redirect("/user/" + user.user_slug);
                })
            } else {
                req.flash("err_msg", "Incorrect password.");

                res.status(401);
                return res.redirect("/user/edit-password/" + user.user_slug);
            }
        });
    },

    async userDeleteGet(req, res, next) {
        const { slug } = req.params;

        const user = await userModel.getUserBySlug(slug);

        if(!user) {
            const error = new Error("User not found.");
            error.status = 404;

            return next(error);
        }

        if(res.locals.sessionUser.userId != user.user_id) {
            res.status(401);
            return res.redirect("/");
        }

        res.status(200);
        return res.render(folderName + "/delete-user.ejs", { user });
    },

    async userDeleteDelete(req, res) {
        const { id } = req.params;
        let { email, password } = req.body;

        email = email.trim();
        
        if(res.locals.sessionUser.userId != id) {
            res.status(401);
            return res.redirect("/");
        }

        const user = await userModel.getUserByEmail(email);

        if(!user) {
            req.flash("err_msg", "Incorrect e-mail.");

            res.status(400);
            return res.redirect("/user/delete-user/" + res.locals.sessionUser.slug);
        }

        bcrypt.compare(password, user.user_password, async (err, success) => {
            if(err) {
                res.status(500);
                return res.redirect("/");
            }

            if(success) {
                await newsModel.deleteNewsByUserId(user.user_id);

                await newsCommentsModel.deleteAllNewsCommentsByAuthorId(user.user_id);

                userModel.deleteUserById(id);

                req.session.destroy(err => {
                    if(err) {
                        res.status(500);
                        return res.redirect("/");
                    }
        
                    res.status(200);
                    return res.redirect("/");
                })
            } else {
                req.flash("err_msg", "Incorrect password.");

                res.status(401);
                return res.redirect("/user/delete-user/" + res.locals.sessionUser.slug);
            }
        })
    }
}