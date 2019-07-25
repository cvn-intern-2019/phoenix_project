const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const express_handlebars_sections = require('express-handlebars-sections');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const session = require('express-session');
const md5 = require('md5');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3010
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

//Database
let con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'kahootdb'
});
con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({secret : 'secret' , resave: false , saveUninitialized : false}));
app.use(passport.initialize());
app.use(passport.session());

//hbs engine
app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/_layouts',
    section: express_handlebars_sections(),  // CONFIGURE 'express_handlebars_sections'
    helpers: {
        section: express_handlebars_sections(),
    }
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');


//Route
app.get('/', (req, res) => {
    res.render('index');
});

app.get('/player', (req, res) => {
    res.render('player/home');
});

app.route('/edit-profile')
    .get(isSignIn,(req,res) => {
        res.render('host/edit-profile',{
            user : req.user,
        });
    })
    .post((req,res) => {
        // if(checkValidEmail(req,res) === false){   
        //     res.render('host/edit-profile',{error:"Email has exist!!"});
        // }
        let edit_profile_query = `UPDATE users SET user_email = '${req.body.email}' where user_id = '${req.user.user_id}'`;
        con.query(edit_profile_query,(err,result) => {
            if(err){
                res.render('host/edit-profile',{
                    error:"Edit Fail!",
                });
            } 
            if(result){
                req.user.user_email = req.body.email;
                res.redirect('/edit-profile');
            }
        }); 
    })


app.route('/change-password')
    .get(isSignIn,(req,res) => {
        res.render('host/change-password');
    })
    .post((req,res) => {
        var error = "";
        var currentpass = md5(req.body.current);
        var newpass = md5(req.body.new);
        var confirmpass = md5(req.body.confirm);
        if(currentpass != req.user.user_password)
            error = 'Current password is incorrect.';
        if(newpass != confirmpass)
            error = 'Confirm password is incorrect.';
        if(error == ""){
            let change_pass_query = `UPDATE users SET user_password = '${newpass}' where user_id = '${req.user.user_id}'`;
            con.query(change_pass_query,(err,result) => {
                if(err){
                    res.render('host/change-password',{
                        error:"Change Password Fail!",
                    });
                }
                if(result){ res.redirect('/change-password');}
            }); 
        }else{
            res.render('host/change-password',{error:error});
        }
    })


app.route('/signin')
    .get((req,res) => {
        res.render('signIn');
    })
    .post(passport.authenticate('local-signin' , {successRedirect:'/edit-profile' ,failureRedirect:'/signin'}))

app.route('/signup')
    .get((req,res) => {
        res.render('signUp');
    })
    // .post((req,res) => {  
    //     let password = md5(req.body.password);
    //     let sql = `INSERT INTO users (user_username,user_password,user_email) VALUES ('${req.body.username}','${password}','${req.body.email}')`;
    //     console.log(sql);
    //     con.query(sql, function (err, result) {
    //         if (err) throw err;
    //         res.render('index');
    //     });   
    // })
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
                    console.log('signup success');
                    return done(null,newUser);
                })
            }
        });
        
    }
));

passport.use('local-signin',new localStrategy(
    (username,password,done) => {
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

passport.use('local-profile',new localStrategy(
    {           passReqToCallback: true
    },
    (req,done) => {

        let edit_profile_query = `UPDATE users SET user_email = '${req.body.email}' where user_username = '${req.user.username}'` 
        console.log(edit_profile_query);
        con.query(edit_profile_query,(err,result) => {
            if(err) throw err;
            console.log(result[0]);
            return done(null,result[0]);
    })}
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

function isSignIn(req,res,next) {
    if(req.isAuthenticated())
        return next();
    else{
        res.redirect('/signin')
    }
}



app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})