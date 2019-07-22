const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const session = require('express-session')
const md5 = require('md5');

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

app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/_layouts',
}));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/signin' , (req,res) => {
    res.render('signIn');
});

app.get('/signup' , (req,res) => {
    res.render('signUp');
});

app.post('/signup' , (req,res) => {
    
    let password = md5(req.body.password);
    let sql = `INSERT INTO users (user_username,user_password,user_email) VALUES ('${req.body.username}','${password}','${req.body.email}')`;
    console.log(sql);
    con.query(sql, function (err, result) {
        if (err) throw err;
        res.render('index');
    });   
});



server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})