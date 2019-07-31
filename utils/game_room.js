const max = 9000;


class Game_rooms {
    constructor() {
        this.Game_rooms = [];
    }

    addRoom(room) {
        this.Game_rooms.push(room);
    }

    getRoomById(id) {
        return this.Game_rooms.filter((game_room) => game_room.id === id)[0];
    }

    removeRoom(id) {
        let game_room = this.getRoomById(id);
        if (game_room)
            this.Game_rooms = this.Game_rooms.filter((game_room) => game_room.id !== id);
        return game_room;
    }
}

class Room {
    constructor(qs) {
        this.qs = qs;
        this.roomId =  Math.floor((Math.random() * 9000) + 1000);
    }
}

module.exports = { Game_rooms, Room };
