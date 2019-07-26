const authMiddleware = require('../middlewares/auth.middleware');
var db = require('../utils/db');
const md5 = require('md5');

module.exports = function(app, passport) {
    app.route('/host/signin')
        .get((req,res) => {
            res.render('signIn' , {csrfToken: req.csrfToken(),signinuser : req.flash('signinuser'),signinpwd : req.flash('signinpwd')});
        })
        .post(passport.authenticate('local-signin' , {
            successRedirect:'/host/edit-profile',
            failureRedirect:'/host/signin',
            failureFlash: true
        }))

    app.route('/host/signup')
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

    app.route('/host/edit-profile')
    .get(authMiddleware.isSignIn,(req,res) => {
        res.render('host/edit-profile',{
            user : req.user,
            csrfToken: req.csrfToken(),
            success: req.flash("editMessage"),
        });
    })
    .post((req,res) => {
        let change_password_query = `SELECT * FROM users where user_email = '${req.body.email}' and user_id != '${req.user.user_id}'`;
        db.query(change_password_query)
            .then(result => {
                // if email isn't exist.
                if(result.length == 0){
                    let edit_profile_query = `UPDATE users SET user_email = '${req.body.email}' where user_id = '${req.user.user_id}'`;
                    db.query(edit_profile_query)
                        .then(result => {
                            req.user.user_email = req.body.email;
                            req.flash("editMessage","Edit Success!");
                            res.redirect('/host/edit-profile');
                        })
                        .catch(err => {
                            res.render('host/edit-profile',{
                            csrfToken: req.csrfToken(),
                            error:"Edit Fail!",
                        });
                    });
                }else{
                    res.render('host/edit-profile',{
                        csrfToken: req.csrfToken(),
                        error:"Email has existed!",
                        user : req.user,
                    });    
                }
                
            })
            .catch(err => {
                res.render('host/edit-profile',{
                csrfToken: req.csrfToken(), 
                error:"Edit Fail!",
            });
        });        
    })

    app.route('/host/change-password')
    .get(authMiddleware.isSignIn,(req,res) => {
        res.render('host/change-password',{
            csrfToken: req.csrfToken(),
            user: req.user,
            success: req.flash("passwordMessage"),
        });
    })
    .post((req,res) => {
        var error = "";
        var currentpass = md5(req.body.current);
        var newpass = md5(req.body.new);
        var confirmpass = md5(req.body.confirm);
        
        if(currentpass != req.user.user_password)
            error = 'Current password is incorrect.';
        else
            if(newpass != confirmpass)
                error = 'Confirm password is incorrect.';

        if(error == ""){
            let change_pass_query = `UPDATE users SET user_password = '${newpass}' where user_id = '${req.user.user_id}'`;
            db.query(change_pass_query)
                .then(result => {
                    req.flash("passwordMessage","Change pass success!");
                    res.redirect('/host/change-password');
                })
                .catch(err => {
                    res.render('host/change-password',{
                    csrfToken: req.csrfToken(), 
                    error:"Change Password Fail!",
                });
            }); 
        }else{
            res.render('host/change-password',{
                error:error,
                csrfToken: req.csrfToken(),
            });
        }
    })    
};