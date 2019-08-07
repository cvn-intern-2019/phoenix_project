const db = require('../utils/db')
const request = require('request');
require('dotenv').config()

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

function reCaptcha(req, res, next) {
    if (
        req.body['g-recaptcha-response'] === undefined ||
        req.body['g-recaptcha-response'] === '' ||
        req.body['g-recaptcha-response'] === null
    ) {
        return res.redirect('back');
    }

    // Secret Key
    const secretKey = process.env.captchaKey;

    // Verify URL
    const verifyUrl = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`;

    // Make Request To VerifyURL
    request(verifyUrl, (err, response, body) => {
        body = JSON.parse(body);

        // If Not Successful
        if (body.success !== undefined && !body.success) {
            return res.redirect('back');
        }

        //If Successful
        next();
    });
}

module.exports = {
    isSignIn,
    alreadySignin,
    checkUserId,
    reCaptcha
}