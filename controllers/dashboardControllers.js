const mongoose = require("mongoose");
const Note = require("../models/notes");
const User = require("../models/user.js");

module.exports.homepage = async (req, res) => {
    res.render("./listings/index.ejs");
};

module.exports.dashboard = async (req, res) => {
    const user = req.user.username;
    const allNotes = await Note.find({});
    res.render("./listings/dashboard.ejs", {allNotes, user});
};

module.exports.signUp = async (req, res) => {
    res.render("./listings/signup.ejs");
};

module.exports.newSignUp = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        // To Login Automaticaly After Signin
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }       
        res.redirect("/dashboard");
        })
    } catch(e) {
        req.flash("error", "This Username Or E-Mail Has Already Registerd !!");
        res.redirect("/signup");
    }
};

module.exports.logIn = (req, res) => {
    res.render("./listings/login.ejs");
};

module.exports.loginUser = async (req, res) => {
    req.flash("success", "Wellcome Back To Google Notes");
    res.redirect("/dashboard");    
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err) {
            return next(err);
        }
        req.flash("success", "You Are Logged-Out Successfully");
        res.redirect("/");
    })
};

module.exports.viewNote = async (req, res) => {
    const noteId = req.params.id;
    const note = await Note.findById({_id: noteId});
    const listing = await Note.findById(noteId).populate("user");
    const currUser = req.user.username;
    res.render("./listings/viewnote.ejs", {note, listing, currUser});
};

module.exports.getAddNote = async (req, res) => {
    res.render("./listings/addnote.ejs");
};

module.exports.addNote = async (req, res) => {
    let newNote = new Note({
        user: req.user.username,
        title: req.body.title,
        body: req.body.body
    });
        
    await newNote.save()
        .then((res) => {
           console.log(res);
        });
    res.redirect("/dashboard");
}

module.exports.getUpdateNote = async (req, res) => {
    const noteId = req.params.id;
    const note = await Note.findById({_id: noteId});
    res.render("./listings/editnote.ejs", {note});
};

module.exports.updateNote = async (req, res) => {
    let noteID = req.params.id;
    await Note.findByIdAndUpdate({_id: noteID},
        {
         title: req.body.title,
         body: req.body.body
        }
    );
    req.flash("success", "Note Updated...");
    res.redirect(`/dashboard/item/${noteID}`);
};

module.exports.deleteNote = async (req, res) => {
    const noteId = req.params.id;
    await Note.findByIdAndDelete({_id: noteId});
    res.redirect("/dashboard");
};

module.exports.searchNote = async (req, res) => {
    const user = req.user.username;
    let { searchTerm } = req.body;
    const notes = await Note.find({ user: searchTerm });
    res.render("./listings/searchnote.ejs", {notes, user, searchTerm});
};