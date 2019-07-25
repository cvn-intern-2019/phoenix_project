const authMiddleware = require('../middlewares/auth.middleware');
var db = require('../utils/db');
var question = require('../models/question/question.model')
const md5 = require('md5');

module.exports = function(app,passport) {
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
        .get((req,res) => {
            res.render('signUp' , { csrfToken: req.csrfToken(), signupMessage : req.flash('signupMessage')});
        })
        .post(passport.authenticate('local-signup' , {
            successRedirect:'/host/signin',
            failureRedirect:'/host/signup',
            failureFlash: true
        }))

    app.get('/host/signout',authMiddleware.isSignIn,(req, res) => {
        req.logout();
        res.redirect('/');
    });

    app.route('/host/edit-profile')
    .get(authMiddleware.isSignIn,(req,res) => {
        res.render('host/edit-profile',{
            user : req.user,
            success: req.flash("editMessage"),
        });
    })
    .post((req,res) => {
        let change_password_query = `SELECT * FROM users where user_email = '${req.body.email}' and user_id != '${req.user.user_id}'`;
        db.query(change_password_query)
            .then(result => {
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
    
    app.route('/host/create-question')
    .get(authMiddleware.isSignIn,(req, res) => {
        res.render('host/create-question',{
            csrfToken: req.csrfToken(),
            user : req.user,
        });
    })
    .post((req,res) => {
        question.add(req.body)
        .then(id => {
            res.send('1');
        })
        .catch(err => {
            // res.render("index");
            res.send(err);

        });
    })

    app.route('/host/update-question/:id')
    .get(authMiddleware.isSignIn,(req, res) => {
        let id = req.params.id;
        let sql = `SELECT * FROM questions WHERE question_id = ${id}`;
        db.query(sql)
            .then(result => {
                if(result.length == 0){
                    res.send('Question not found');
                }else{
                    res.render('host/update-question',{
                        csrfToken: req.csrfToken(),
                        question:result[0],
                        user : req.user
                    });    
                }
            })
    })
    .post((req,res) => {
        let id = req.params.id;
        let sql = `UPDATE questions SET question_content = '${req.body.content}',question_answer1 = '${req.body.answer1}',question_answer2 = '${req.body.answer2}',question_answer3 = '${req.body.answer3}',question_answer4 = '${req.body.answer4}',question_answercorrect = '${req.body.correctanswer}'  WHERE question_id = ${1};`
        db.query(sql)
        .then(result => {
            res.redirect(`/host/update-question/${id}`);
        })
        .catch(err => {
            res.redirect(`/host/update-question/${id}`);

        });
    })
};