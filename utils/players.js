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