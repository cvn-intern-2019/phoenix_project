const totalScore = 300;

class Players {
    constructor() {
        this.players = [];
    }

    addPlayer(player) {
        this.players.push(player);
    }

    getPlayerByRoom(roomId) {
        let players = this.players.filter((player) => player.roomId === roomId);
        console.log(players);
        return players;
    }

    getPlayerById(playerId) {
        return this.players.filter((player) => player.id === playerId)[0];
    }

    removePlayer(playerId) {
        if (this.findPlayerById(playerId)) {
            this.players.filter((player) => player.id !== playerId);
        }
    }

    checkAnswerAndUpdateScore(correctAnswer, playerId) {
        let player = this.findPlayerById(playerId);
        if (correctAnswer === player.answer)
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

    constructor() {
        console.log("Error when init player");
    }

    calculateScore() {
        // Total score: 300 pt
        // Each second will subtract 10 pt
        this.score += totalScore - this.answerTime * 10;
        player.answerTime = 0;
        this.answer = 0;
    }
}