const authMiddleware = require('../middlewares/auth.middleware');

module.exports = function(app, passport) {
    app.route('/host/signin')
        .get((req, res) => {
            res.render('signIn', { signinuser: req.flash('signinuser'), signinpwd: req.flash('signinpwd') });
        })
        .post(passport.authenticate('local-signin', {
            successRedirect: '/host/profile',
            failureRedirect: '/host/signin',
            failureFlash: true
        }))

    app.route('/host/signup')
        .get((req, res) => {
            res.render('signUp', { signupMessage: req.flash('signupMessage') });
        })
        .post(passport.authenticate('local-signup', {
            successRedirect: '/host/signin',
            failureRedirect: '/host/signup',
            failureFlash: true
        }))

    app.get('/host/signout', authMiddleware.isSignIn, (req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.get('/host/profile', authMiddleware.isSignIn, (req, res) => {
        res.render('profile', { user: req.user });
    })

    app.route('/host/questions')
        .get((req, res) => {
            res.render('questions/list');
        })
};