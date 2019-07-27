function isSignIn(req,res,next) {
    if(req.isAuthenticated())
        return next();

    res.redirect("/host/signin");
}

function alreadySignin(req,res,next) {
    if(!req.user)
        return next();

    res.redirect("/");
}


module.exports = {
    isSignIn,
    alreadySignin
}