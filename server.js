// Dependencies
require("dotenv").config();
const express = require("express");
const session = require("express-session");
const methodOverride = require("method-override");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const mysqlSession = require("express-mysql-session")(session);

const app = express();
app.use("/public", express.static("public"));

const mysqlStorage = new mysqlSession({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,

    schema: {
		tableName: 'tb_user_sessions',
		columnNames: {
			session_id: 'session_id',
			expires: 'expires',
			data: 'data'
		}
	}
})

// Routes
const indexRoute = require("./routes/indexRoute");
const ajaxRoute = require("./routes/ajaxRoute");
const newsRoute = require("./routes/newsRoute");
const userRoute = require("./routes/userRoute");

// Config
app.set("view engine", "ejs");
app.use(methodOverride("_method"));
app.use(cookieParser('secret'));
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mysqlStorage
}))
app.use(express.urlencoded({ extended: false }));
app.use(flash());

const port = process.env.PORT || 8080;
const isProduction = process.env.NODE_ENV === 'production';

// res.locals config
app.use((req, res, next) => {
    res.locals.err_msg = req.flash("err_msg");

    if(req.session.isAuth) {
        res.locals.sessionUser = {
            userId: req.session.userId,
            username: req.session.username,
            email: req.session.email,
            slug: req.session.slug
        };
    } else {
        res.locals.sessionUser = false;
    }

    next();
})

// Routes
    app.use("/", indexRoute);

    app.use("/_ajax", ajaxRoute);

    app.use("/news", newsRoute);

    app.use("/user", userRoute);

    app.use((req, res, next) => {
        const err = new Error("Page not found");
        err.status = 404;

        next(err);
    });

// Error handling
    if(!isProduction) {
        // Development
        app.use((err, req, res, next) => {
            res.status(err.status || 500);
            return res.send(err);
        })
    } else {
        // Production
        app.use((err, req, res, next) => {
            if(!res.locals.sessionUser) res.locals.sessionUser = false;

            const error_status = err.status || 500;

            res.locals.error_page_status = error_status;
            res.locals.error_page_message = err.message;
                
            res.status(error_status);
    
            return res.render("errors/error.ejs");
        });
    }


app.listen(port, () => {
    console.log(`Server online in localhost:${port}`);
})