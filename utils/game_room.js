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

    removeRoom(id) {
        let game_room = this.getRoomById(id);
        if (game_room)
            this.Game_rooms = this.Game_rooms.filter((game_room) => game_room.roomId !== id);
        return game_room;
    }
}

class Room {
    constructor(qs,list_question) {
        this.qs = qs;
        this.roomId =  Math.floor((Math.random() * 9000) + 1000);
        this.list_question = list_question;
    }
}

module.exports = { Game_rooms, Room };
