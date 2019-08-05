const max = 9000;

class Game_rooms {
    constructor() {
        this.Game_rooms = [];
    }

    addRoom(room) {
        this.Game_rooms.push(room);
    }

    getRoomById(id) {
        return this.Game_rooms.filter((room) => room.roomId == id)[0];
    }

    startGame(id) {
        let room = this.getRoomById(id);
        room.isStarted = true;
        this.removeRoomById(id);
        this.addRoom(room);
    }

    endGame(id) {
        let room = this.getRoomById(id);
        room.isEnded = true;
        this.removeRoomById(id);
        this.addRoom(room);
    }

    removeRoomById(id) {
        let game_room = this.getRoomById(id);
        if (game_room)
            this.Game_rooms = this.Game_rooms.filter((game_room) => game_room.roomId != id);
        return this.Game_rooms;

    }

    removeEndedRoom() {
        this.Game_rooms = this.Game_rooms.filter((room) => room.isEnded == false);
    }

    updateQuestionIndexByRoomId(id) {
        let room = this.getRoomById(id);
        room.question_index++;
        this.removeRoomById(id);
        this.addRoom(room);
    }
}

class Room {
    constructor(questionset, list_question) {
        this.questionset = questionset;
        this.roomId = Math.floor((Math.random() * 9000) + 1000);
        this.list_question = list_question;
        this.question_index = 0;
        this.isStarted = false;
        this.isEnded = false;
    }
}

module.exports = { Game_rooms, Room };