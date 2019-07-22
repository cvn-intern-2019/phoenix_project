const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const session = require('express-session');
const md5 = require('md5');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

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
app.use(session({secret : 'secret'}));
app.use(passport.initialize());
app.use(passport.session());

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/_layouts',
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index');
});

app.route('/signin')
    .get((req,res) => {
        res.render('signIn');
    })
    .post(passport.authenticate('local' , {successRedirect:'/' ,failureRedirect:'/signin'}))

app.route('/signup')
    .get((req,res) => {
        res.render('signUp');
    })
    .post((req,res) => {  
        let password = md5(req.body.password);
        let sql = `INSERT INTO users (user_username,user_password,user_email) VALUES ('${req.body.username}','${password}','${req.body.email}')`;
        console.log(sql);
        con.query(sql, function (err, result) {
            if (err) throw err;
            res.render('index');
        });   
    })

passport.use(new localStrategy(
    (username,password,done) => {
        let pwd = md5(password);
        let sql = `SELECT * FROM users where user_username = '${username}' AND user_password = '${pwd}'`;
        con.query(sql, function (err, result) {
            console.log(result[0]);
            return done(err,result[0]);
        });
        
    }
));

passport.serializeUser((user,done) => {
    done(null,user[0]);
    console.log(user[0]);
    
});

passport.deserializeUser((id,done) => {
    let sql = `SELECT * FROM kahootdb.users where user_id = '${id}'`;
    con.query(sql, function (err, result) {
        done(err,result[0]);
    });
    
})


server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})