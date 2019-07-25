function isSignIn(req,res,next) {
    if(req.isAuthenticated())
        return next();

    res.redirect("/host/signin");
}

module.exports = {
    isSignIn
}