const localStrategy = require('passport-local').Strategy;
var db = require('../utils/db');
const md5 = require('md5');

module.exports = function(passport) {
    passport.use('local-signup', new localStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        (req, username, password, done) => {
            let sql = `SELECT * FROM users where user_username = '${username}' OR user_email = '${req.body.email}'`;
            db.query(sql)
                .then(rows => {
                    if (rows.length) {
                        return done(null, false, req.flash('signupMessage', 'Username already used'));
                    } else {
                        let newUser = {
                            user_username: username,
                            user_password: md5(password),
                            user_email: req.body.email
                        };

                        let insertQuery = `INSERT INTO users (user_username,user_password,user_email) values ('${newUser.user_username}','${newUser.user_password}','${newUser.user_email}')`
                        db.query(insertQuery)
                            .then(result => {
                                // console.log(result);
                                newUser.user_id = result.insertId;
                                console.log('signup sucess');
                                return done(null, newUser);
                            })
                            .catch(err => {
                                throw err;
                            });
                    }
                })
                .catch(err => {
                    return done(err);
                });
        }
    ));

    passport.use('local-signin', new localStrategy({
            passReqToCallback: true
        },
        (req, username, password, done) => {
            let sql = `SELECT * FROM users where user_username = '${username}'`;
            db.query(sql)
                .then(result => {
                    if (!result.length) {
                        return done(null, false, req.flash('signinuser', 'Username not found'))
                    }
                    if (md5(password) !== result[0].user_password)
                        return done(null, false, req.flash('signinpwd', 'Wrong password'));

                    return done(null, result[0]);
                })
                .catch(err => {
                    return done(err);
                });
        }
    ));

    passport.serializeUser((user, done) => {
        done(null, user.user_id);
    });

    passport.deserializeUser((id, done) => {
        let sql = `SELECT * FROM users where user_id = '${id}'`;
        db.query(sql)
            .then(result => {
                done(null, result[0]);
            })
            .catch(err => {
                done(err, false)
            })
    })
}