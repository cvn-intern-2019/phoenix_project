const passport = require('passport');


function isSignIn(req,res,next) {
    if(req.isAuthenticated())
        return next();

    res.send('Not login');
}

module.exports = {
    isSignIn
}