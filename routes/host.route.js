const express = require('express');
const router = express.Router();
const passport = require('passport');
const authMiddleware = require('../middlewares/auth.middleware');




router.route('/signin')
    .get((req,res) => {
        res.render('signIn');
    })
    .post(passport.authenticate('local-signin' , {successRedirect:'/host/profile' ,failureRedirect:'/signin'}))

router.route('/signup')
    .get((req,res) => {
        res.render('signUp');
    })
    .post(passport.authenticate('local-signup' , {successRedirect:'/signin' ,failureRedirect:'/signup'}))
    
passport.use('local-signup',new localStrategy(
    {   
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    (req,username,password,done) => {
        let sql = `SELECT * FROM users where user_username = '${username}' OR user_email = '${req.body.email}'`;
        con.query(sql , (err,result) => {
            if(err)
                return done(err);
            if(result.length) {
                return done(null,false)
            }else {
                let newUser = {
                    user_username : username,
                    user_password : md5(password),
                    user_email : req.body.email
                };

                let insertQuery = `INSERT INTO users (user_username,user_password,user_email) values ('${newUser.user_username}','${newUser.user_password}','${newUser.user_email}')` 
                con.query(insertQuery,(err,result) => {
                    if(err) throw err;
                    newUser.user_id = result.insertId;
                    console.log('signup sucess');
                    return done(null,newUser);
                })
            }
        });
        
    }
));

passport.use('local-signin',new localStrategy(
    {   
        passReqToCallback: true
    },
    (req,username,password,done) => {
        let sql = `SELECT * FROM users where user_username = '${username}'`;
        con.query(sql , (err,result) => {
            if(err)
                return done(err);
            if(!result.length) {
                return done(null,false)
            }
            if(!md5(password) == result[0].user_password)
                return done(null,false);

            console.log('login success');
            return done(null,result[0]);
        });
        
    }
));

passport.serializeUser((user, done) => {
    done(null, user.user_id);
});

passport.deserializeUser((id,done) => {
    let sql = `SELECT * FROM users where user_id = '${id}'`;
    con.query(sql, function (err, result) {
        done(err,result[0]);
    });
    
})


router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

module.exports = router;