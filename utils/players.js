const totalScore = 300;

class Players {
    constructor() {
        this.players = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }

    getPlayerByRoom(roomId) {
        let players = this.players.filter((player) => player.roomId == roomId);

        // Sort Players in room
        if (players.length > 1) {
            let sorted = false
            while (!sorted) {
                sorted = true
                for (var i = 1; i < players.length; i++) {
                    if (players[i].score > players[i - 1].score) {
                        let temp = players[i];
                        players[i] = players[i - 1];
                        players[i - 1] = temp;
                        sorted = false;
                    }
                }
            }
        }


        return players;
    }

    getPlayerById(playerId) {
        return this.players.filter((player) => player.id == playerId)[0];
    }

    removePlayer(playerId) {
        let player = this.getPlayerById(playerId);

        if (player) {
            this.players = this.players.filter((player) => player.id != playerId);
        }

        return player;
    }

    updatePlayer(playerData) {
        // Update player info
        if (playerData.id) {
            let player = this.getPlayerById(playerData.id);
            player.score = playerData.score;
            player.roomId = playerData.roomId;
            player.answer = playerData.answer;
            player.answerTime = playerData.answerTime;

            this.removePlayer(playerData.id);
            this.addPlayer(player);
        }
    }

    checkAnswerAndUpdateScore(correctAnswer, playerId) {
        let player = this.getPlayerById(playerId);
        if (correctAnswer == player.answer)
            player.calculateScore();
    }
    deletePlayersByRoomId(id) {
        let deletePlayers = this.getPlayerByRoom(id);
        for (let i = 0; i < deletePlayers.length; i++) {
            this.removePlayer(deletePlayers[i].id);
        }
    }

}
class Player {
    constructor(id, name, roomId) {
        this.id = id;
        this.name = name;
        this.roomId = roomId;
        this.score = 0;
        this.answer = 0;
        this.answerTime = 0;
    }

    calculateScore() {
        // Total score: 300 pt
        // Each second will subtract 10 pt
        this.score += totalScore - this.answerTime * 10;
        this.answerTime = 0;
        this.answer = 0;
    }
}

module.exports = { Players, Player };