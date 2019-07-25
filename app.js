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
const morgan = require('morgan');

const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

// //Database
// let con = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: '12345678',
//     database: 'kahootdb'
// });
// con.connect(function (err) {
//     if (err) throw err;
//     console.log("Connected!");
// });
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
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

app.use('/questionset', require('./routes/questionset/questionset.route'));


app.route('/signin')
    .get((req,res) => {
        res.render('signIn');
    })
    .post(passport.authenticate('local-signin' , {successRedirect:'/profile' ,failureRedirect:'/signin'}))

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

    res.send('Not login');
}

app.get('/profile',isSignIn,(req,res)=>{
    res.send('Hello ' + req.user.user_username);
})



app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})