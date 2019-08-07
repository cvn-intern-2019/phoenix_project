const socketIO = require('socket.io');

const { Game_rooms, Room } = require('./game_room');

const { Players, Player } = require('./players');

const players = new Players();

const Game_room = new Game_rooms();

module.exports.listen = (server) => {
    let io = socketIO.listen(server);
    io.on('connection', (socket) => {

        socket.on('create_room', (data) => {
            if (Game_room.Game_rooms.length == Game_room.max_length) {
                socket.emit('OutOfRoom');
            } else {
                let room = new Room(data[1], data[0]);
                let checkDuplicatePin = Game_room.getRoomById(room.roomId);
                while (checkDuplicatePin) {
                    room = new Room(data[1], data[0]);
                    checkDuplicatePin = Game_room.getRoomById(room.roomId);
                }
                Game_room.addRoom(room);
                socket.emit('waiting-room', room.roomId);
            }
        })

        socket.on('host-join', (pin) => {
            socket.join(pin);
        })

        socket.on('player-join', (info) => {
            let pin = info.pin;
            let room = Game_room.getRoomById(pin);
            if (!room) {
                socket.emit('roomNotExists');
                players.removePlayer(socket.id);
            } else {
                if (!room.isStarted) {
                    socket.emit('roomFound');
                    socket.join(pin);
                    players.addPlayer(new Player(socket.id, info.nickname, pin));
                    io.to(pin).emit('updatePlayerList', players.getPlayerByRoom(pin));
                    io.to(`${players.players[parseInt(players.players.length - 1)].id}`).emit("playerInfo", players.players[parseInt(players.players.length - 1)]);
                } else {
                    io.to(socket.id).emit("alreadyStart");
                }

            }
        })

        socket.on("start-game", (pin) => {
            Game_room.startGame(pin);
            io.to(pin).emit("redirect-to-question");
        })

        socket.on("statisticRedirect", (pin) => {
            io.to(pin).emit("redirect-to-question");
        })

        socket.on("getQuestion", (pin) => {
            let room = Game_room.getRoomById(pin);
            if (room) {
                if (room.question_index < room.list_question.length) {
                    socket.emit("question-content", room.list_question[room.question_index], room.question_index);
                } else {
                    socket.emit("final-statistic");
                }
            } else {
                socket.emit("roomDisconnected");
            }
        })

        socket.on("nextQuestion", (pin) => {
            Game_room.updateQuestionIndexByRoomId(pin);
        })

        socket.on("thisIsMyAnswer", (player, correctAnswer) => {
            players.updatePlayer(player);
            players.checkAnswerAndUpdateScore(correctAnswer, player.id);
        })

        socket.on("updateProfile", (playerId) => {
            let player = players.getPlayerById(playerId);
            socket.emit("updatedProfile", player);
        })
        socket.on("listPlayerScoreRequest", (pin) => {
            socket.emit("listPlayerScoreReponse", players.getPlayerByRoom(pin));
        })

        socket.on("deletePlayer", (pinRoom) => {
            players.deletePlayersByRoomId(pinRoom);
            Game_room.removeRoomById(pinRoom);
        })

        socket.on("cancelRoom", (pin) => {
            io.to(pin).emit('roomCanceled');
        })

        socket.on('endGame', (pin) => {
            Game_room.endGame(pin);
        })

        socket.on("hostDisconnect", (pin) => {
            let room = Game_room.getRoomById(pin);
            if (room) {
                players.deletePlayersByRoomId(pin);
                Game_room.removeRoomById(pin);
            }
            socket.emit("roomDisconnected");
        })

        socket.on('disconnect', () => {
            let player = players.getPlayerById(socket.id);
            if (player) {
                let room = Game_room.getRoomById(player.roomId);
                let oldRoomId = player.roomId;

                if (room.isStarted) {
                    player.roomId = oldRoomId;
                } else {
                    players.removePlayer(player.id);
                }
                io.to(oldRoomId).emit('updatePlayerList', players.getPlayerByRoom(oldRoomId));
            } else {
                Game_room.removeEndedRoom();
            }
        })
    })
}