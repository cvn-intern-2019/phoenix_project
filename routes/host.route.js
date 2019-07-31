const authMiddleware = require('../middlewares/auth.middleware');
const host_controller = require('../controllers/host.controller');

module.exports = function (app, passport) {
    app.route('/host/signin')
        .get(authMiddleware.alreadySignin, host_controller.getSignIn)
        .post(passport.authenticate('local-signin', {
            successRedirect: '/host/questionset',
            failureRedirect: '/host/signin',
            failureFlash: true
        }))

    app.route('/host/signup')
        .get(authMiddleware.alreadySignin, host_controller.getSignUp)
        .post(passport.authenticate('local-signup', {
            successRedirect: '/host/signin',
            failureRedirect: '/host/signup',
            failureFlash: true
        }))

    app.get('/host/signout', authMiddleware.isSignIn, host_controller.signOut);

    app.route('/host/edit-profile')
        .get(authMiddleware.isSignIn, host_controller.getEdit)
        .post(host_controller.postEdit)

    app.route('/host/change-password')
        .get(authMiddleware.isSignIn, host_controller.getchangePassword)
        .post(host_controller.postchangePassword)


    app.get('/host/profile', authMiddleware.isSignIn, host_controller.profile)

    app.get('/host/waiting', (req,res) => {
        res.render('../views/host/waiting.hbs' , {user : req.user});
    });
};