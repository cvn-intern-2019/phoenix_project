const host_model = require('../models/host.model');
const db = require('../utils/db');
const md5 = require('md5');


module.exports = {
    getSignIn : (req,res) => {
        res.render('signIn' , {csrfToken: req.csrfToken(),signinuser : req.flash('signinuser'),signinpwd : req.flash('signinpwd')});
    },
    getSignUp : (req,res) => {
        res.render('signUp' , { csrfToken: req.csrfToken(), signupMessage : req.flash('signupMessage')});
    },
    signOut : (req, res) => {
        req.logout();
        res.redirect('/');
    },
    getEdit : (req,res) => {
        res.render('host/edit-profile',{
            user : req.user,
            csrfToken: req.csrfToken(),
            success: req.flash("editMessage"),
        });
    },
    postEdit : (req,res) => {
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
    },
    getchangePassword : (req,res) => {
        res.render('host/change-password',{
            csrfToken: req.csrfToken(),
            user: req.user,
            success: req.flash("passwordMessage"),
        });
    },
    postchangePassword : (req,res) => {
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
    },
    profile : (req, res) => {
        res.render('profile', { user: req.user });
    }
}