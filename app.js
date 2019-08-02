require('dotenv').config()
const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const exphbs = require('express-handlebars');
const express_handlebars_sections = require('express-handlebars-sections');
const bodyParser = require('body-parser')
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
const passport = require('passport');
const multer = require('multer')
const csrf = require('csurf');

const publicPath = path.join(__dirname, '/public');
const port = process.env.PORT || 3000;
let app = express();
let server = http.createServer(app);
let io = socketIO(server);
let csrfProtection = csrf();

const storage = multer.diskStorage({
    destination: './public/img/', 
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
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

// app.use('/questionset', require('./routes/questionset.route'));

require('./models/passport')(passport);
require('./routes/route')(app);
require('./routes/player.route')(app);
require('./routes/host.route')(app, passport);
require('./routes/questionset.route')(app);
require('./routes/question.route')(app);
const { Game_rooms, Room } = require('./utils/game_room');

const { Players, Player } = require('./utils/players');

const players = new Players();

const Game_room = new Game_rooms();

io.on('connection', (socket) => {
    console.log("A new user just connected");

    socket.on('create_room', (data) => {
        let room = new Room(data[1], data[0]);
        Game_room.addRoom(room);
        console.log(Game_room);
        socket.emit('waiting-room', room.roomId);
    })

    socket.on('host-join' , (pin) => {
        socket.join(pin);
    })

    socket.on('player-join', (info) => {
        let pin = info.pin;
        if (!Game_room.getRoomById(pin)) {
            console.log('Room not found');
            socket.emit('roomNotExists');
        }

        socket.join(pin);
        players.removePlayer(socket.id);
        players.addPlayer(new Player(socket.id, info.nickname, pin));        
        io.to(pin).emit('updatePlayerList', players.getPlayerByRoom(pin));
        io.to(`${players.players[parseInt(players.players.length-1)].id}`).emit("playerInfo",players.players[parseInt(players.players.length-1)]);

    })

    socket.on("start-game", (pin) => {
        io.to(pin).emit("redirect-to-question");
    })

    socket.on("getQuestion", (pin) => {
        let room = Game_room.getRoomById(pin);
        if(room.question_index < room.list_question.length)
            socket.emit("question-content", room.list_question[room.question_index]);
        else
            socket.emit("final-statistic");    
    })
    
    socket.on("nextQuestion",(pin)=>{
        Game_room.updateQuestionIndexByRoomId(pin);
    })

    socket.on("thisIsMyAnswer",(player,correctAnswer)=>{
        console.log(players);
        players.updatePlayer(player);
        players.checkAnswerAndUpdateScore(correctAnswer,player.id);
    })
    
    socket.on("updateProfile",(playerId)=>{
        let player = players.getPlayerById(playerId);
        socket.emit("updatedProfile",player);
    })
    socket.on("listPlayerScoreRequest",(pin)=>{
        socket.emit("listPlayerScoreReponse",players.getPlayerByRoom(pin));
    })

    socket.on("deletePlayer", (pinRoom) => {
        players.deletePlayersByRoomId(pinRoom);
        Game_room.removeRoomById(pinRoom);
        console.log(players);
        console.log(Game_room);
    })
   
    socket.on('disconnect', () => {
        console.log("Dis");
        // let player = players.removePlayer(socket.id);
        // if (player) {
        //     io.to(player.roomId).emit('updatePlayerList', players.getPlayerByRoom(player.roomId));
        // }
    })
})
server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})