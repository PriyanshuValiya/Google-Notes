require ("dotenv").config();

const express = require("express");
const app = express();
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const ejsMate = require("ejs-mate"); //For Boilerplate
const mongoose = require('mongoose');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const Note = require("./models/notes.js");
const methodOverride = require("method-override");
const { isLoggedIn } = require("./public/middleware.js");
const dashboardController = require("./controllers/dashboardControllers.js");

const PORT = process.env.PORT || 3000;
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({extended: "true"}));
app.engine("ejs", ejsMate);
app.use(methodOverride("_method"));
app.use(express.json());


const dbUrl = process.env.ATLASDB_URL;

main()
.then((result) => {
    console.log("Mongo's Connection Is Successfull !");
 })
 .catch((e) =>{
    console.log(e);
 });

async function main() {
    await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("Error in Mongo Session Store !!", err);
})

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expiree: Date.now() + 7 * 24 * 60 * 60 * 1000,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/* This is for only first time make fake user, after that we can comment it.
app.get("/demouser", async (req, res) => {
    let fakeUser = new User({
      email: "priyansu@gmail.com",
      username: "Priyanshu"
    });
  
    let registeredUser = await User.register(fakeUser, "Priyansu@2006");
    res.send(registeredUser);
}); */


// Index Route
app.get("/", dashboardController.homepage);

// Deshboard Route
app.get("/dashboard", isLoggedIn, dashboardController.dashboard);

// SignUp Route
app.get("/signup", dashboardController.signUp);
app.post("/signup", dashboardController.newSignUp);

// LogIn Route
app.get("/login", dashboardController.logIn);
app.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), dashboardController.loginUser);

// LogOut Route
app.get("/logout", dashboardController.logout);

// Create Route
app.get("/dashboard/add", isLoggedIn, dashboardController.getAddNote);
app.post("/dashboard/add", dashboardController.addNote);

// Viewnote Route
app.get("/dashboard/item/:id", dashboardController.viewNote);

// Edit Route
app.get("/dashboard/item/:id/edit", isLoggedIn, dashboardController.getUpdateNote);

// Update Route
app.put("/dashboard/item/:id", isLoggedIn, dashboardController.updateNote);

// Delete Route
app.delete("/dashboard/item/:id", isLoggedIn, dashboardController.deleteNote);

// Search Route
app.post("/dashboard/search", dashboardController.searchNote);

app.use((req, res) => {
    res.send("404! Current Page Is Not Found :(");
});

app.listen(PORT, () => {
    console.log(`Server of live on http://localhost:${PORT}`)
});