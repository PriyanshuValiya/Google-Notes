module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()) {
        req.flash("error", "You Must Be Logged In To Create New Note.");
        return;
    }
    next();
};