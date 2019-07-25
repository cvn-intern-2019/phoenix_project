const localStrategy = require('passport-local').Strategy;
const mysql = require('mysql');
const md5 = require('md5');

let con = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

module.exports = function(passport) {
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
                    return done(null,false, req.flash('signupMessage' , 'Username already used'));
                }else {
                    let newUser = {
                        user_username : username,
                        user_password : password,
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
                    return done(null,false,req.flash('signinuser' , 'Username not found'))
                }
                if(md5(password) !== result[0].user_password)
                    return done(null,false,req.flash('signinpwd' , 'Wrong password'));

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
}