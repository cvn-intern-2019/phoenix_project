const db = require('../utils/db')


function isSignIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect("/host/signin");
}

function alreadySignin(req, res, next) {
    if (!req.user)
        return next();

    res.redirect("/");
}

function checkUserId(req, res, next) {
    let sql = `SELECT user_id FROM user_questionset WHERE questionset_id = ${req.params.qs_id}`
    db.query(sql)
        .then(result => {
            if (result.length > 0 && req.user.user_id == result[0].user_id)
                return next();
            res.render('error');
        })
        .catch(err => {
            console.log(err);
            res.render('error');
        });
}

module.exports = {
    isSignIn,
    alreadySignin,
    checkUserId
}