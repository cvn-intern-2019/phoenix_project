require('dotenv').config()
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const express_handlebars_sections = require('express-handlebars-sections');
const mysql = require('mysql');
const bodyParser = require('body-parser')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const morgan = require('morgan');
const csrf = require('csurf');
const multer = require('multer');

const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let csrfProtection = csrf();

const storage = multer.diskStorage({
    destination: './public/img/', 
    filename: function (req, file, cb) {
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }	
})
const upload = multer({
    storage: storage
}).single('question_img');
app.use(upload);


//hbs engine
app.engine('hbs', exphbs({
    defaultLayout: 'main.hbs',
    layoutsDir: 'views/_layouts',
    section: express_handlebars_sections(), // CONFIGURE 'express_handlebars_sections'
    helpers: {
        section: express_handlebars_sections(),
    }
}));

app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: process.env.session, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(csrfProtection);

app.use('/questionset', require('./routes/questionset.route'));

require('./models/passport')(passport);
require('./routes/route')(app);
require('./routes/player.route')(app);
require('./routes/host.route')(app, passport);
require('./routes/question.route')(app);

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})


