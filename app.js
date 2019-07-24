require('dotenv').config()
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const session = require('express-session');
const passport = require('passport');

const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3000
let app = express();
let server = http.createServer(app);
let io = socketIO(server);

let host = require('./routes/host.route'); 

//Database
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

app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({secret : process.env.session , resave: false , saveUninitialized : false}));
app.use(passport.initialize());
app.use(passport.session());

//hbs engine
app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/_layouts',
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index');
});



app.use('/host', host);

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})