// Dependencies
const bcrypt = require("bcrypt");
const { randomBytes } = require("crypto");

// Models & config
const userModel = require("../models/userModel");
const emailVerificationModel = require("../models/emailVerificationModel");

// Utils:
const { sendEmail } = require("../utils/sendEmail");
const { deleteExpiredTokensAndAccounts } = require("../utils/deleteExpired");

const folderName = "index";

module.exports = {
    authLoginGet(req, res) {
        res.status(200);
        return res.render(folderName + "/login.ejs");
    },

    authRegisterGet(req, res) {
        res.status(200);
        return res.render(folderName + "/register.ejs");
    },
    
    async authLoginPost(req, res, next) {
        let { email, password } = req.body;
        email = email.trim();
        
        if(email === '' || password === '') {
            res.status(400);
            return res.render(folderName + "/login.ejs", { err_msg: "Please fill in all the required fields." })
        }

        await deleteExpiredTokensAndAccounts();
        
        const user = await userModel.getUserByEmail(email);

        let incorrectLogin = "Email or password are incorrect";

        if(!user) {
            res.status(401);
            return res.render(folderName + "/login.ejs", { err_msg: incorrectLogin });
        }

        if(user.email_verificated == 0) {
            res.status(401);
            req.flash("err_msg", "Please, verificate your e-mail address in order to login");
            
            return res.redirect("/login");
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

    async authAjaxEmailVerification(req, res, next) {
        let { username, email, password } = req.body;

        username = username.trim();
        email = email.trim();
    
        if(username === '' || email === '' || password === '') {
            res.status(400);
            return res.render(folderName + "/register.ejs", { err_msg: "Please fill in all the required fields." })
        }

        await deleteExpiredTokensAndAccounts();

        const existentEmail = await userModel.getUserByEmail(email);

        if(existentEmail) {
            res.status(200);

            return res.json({ success: false, msg: "This e-mail has already been registered." });
        }

        // Create user in database (email_verificated is 0 by default)
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
                // Generate token and save in tb_email_verification
                const maxDatabaseLengthToken = 128;

                randomBytes(maxDatabaseLengthToken, async (err, buff) => {
                    if(err) {
                        const error = new Error("Oops... Something went wrong, please come back later.")
                        error.status = 500;
                        next(error);
                    }

                    const randomToken = buff.toString("base64url").slice(0, maxDatabaseLengthToken);

                    await emailVerificationModel.saveNewVerification(email, randomToken, results.insertId);
                    
                    await deleteExpiredTokensAndAccounts();

                    // Send e-mail verification
                    const url = `http://localhost:${process.env.PORT || 8080}/email-verification/${randomToken}`;
                    
                    const result = sendEmail(email, "E-mail verification", `Click on this link and login to your account: <br> <a href="${url}">${url}</a>`);
    
                    res.status(201);
                    return res.json({ success: true, result: result });
                })
            })
            .catch((err) => {
                if(err.code === "ER_DUP_ENTRY") {
                    res.status(400);
                    req.flash("err_msg", "This email has already been registered.");

                    return res.redirect("/register");
                }
    
                res.status(500);
                return res.render(folderName + "/register.ejs", { err_msg: "An error occurred, please try again later." });
            });
        })
    },

    async authEmailVerificationToken(req, res) {
        const { token } = req.params;

        await deleteExpiredTokensAndAccounts();

        const verification = await emailVerificationModel.getVerificationByToken(token);

        if(!verification) {
            res.status(400);

            return res.redirect("/login");
        }

        const userId = verification.verification_user;
        const email = verification.verification_email;

        await userModel.validateEmail(email);
        emailVerificationModel.deleteVerificationByUserId(userId);

        return res.redirect("/login");
    },
}