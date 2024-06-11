const express = require("express");
const app = express();
const router = express.Router();

const User = require("../models/user");
app.use(express.urlencoded({extended: "true"}));

router.get("/signup", (req, res) => {
    res.render("users/signup.ejs");
});

router.post("/signup", async(req, res) => {
    let {username, email, password} = req. body;
    let name = req.body.username;
    const newUser = new User({email, username});
    const registeredUser = await User.register(newUser, password);
    res.redirect("/dashboard");
}); 

module.exports = router;