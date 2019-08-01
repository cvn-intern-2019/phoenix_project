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
        console.log(players.getPlayerByRoom(pin));
        //   socket.broadcast.to(params.room).emit('newMessage', generateMessage('Admin', "New User Joined!"));
    })

    socket.on('disconnect', () => {
        let player = players.removePlayer(socket.id);
        console.log("A user disconnect");
        if (player) {
            io.to(player.roomId).emit('updatePlayerList', players.getPlayerByRoom(player.roomId));
        }
    });


    // //When a host or player leaves the site
    // socket.on('disconnect', () => {
    //     let game = games.getGame(socket.id); //Finding game with socket.id
    //     //If a game hosted by that id is found, the socket disconnected is a host
    //     if(game){
    //         //Checking to see if host was disconnected or was sent to game view
    //         if(game.gameLive == false){
    //             games.removeGame(socket.id);//Remove the game from games class
    //             console.log('Game ended with pin:', game.pin);

    //             var playersToRemove = players.getPlayers(game.hostId); //Getting all players in the game

    //             //For each player in the game
    //             for(var i = 0; i < playersToRemove.length; i++){
    //                 players.removePlayer(playersToRemove[i].playerId); //Removing each player from player class
    //             }

    //             io.to(game.pin).emit('hostDisconnect'); //Send player back to 'join' screen
    //             socket.leave(game.pin); //Socket is leaving room
    //         }
    //     }else{
    //         //No game has been found, so it is a player socket that has disconnected
    //         var player = players.getPlayer(socket.id); //Getting player with socket.id
    //         //If a player has been found with that id
    //         if(player){
    //             var hostId = player.hostId;//Gets id of host of the game
    //             var game = games.getGame(hostId);//Gets game data with hostId
    //             var pin = game.pin;//Gets the pin of the game
                
    //             if(game.gameLive == false){
    //                 players.removePlayer(socket.id);//Removes player from players class
    //                 var playersInGame = players.getPlayers(hostId);//Gets remaining players in game

    //                 io.to(pin).emit('updatePlayerLobby', playersInGame);//Sends data to host to update screen
    //                 socket.leave(pin); //Player is leaving the room
            
    //             }
    //         }
    //     }
        
    // });





})



server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})