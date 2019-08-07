socket.on('roomNotExists', () => {
    $('#checking-room').html('Room Not Found');
    setTimeout(() => {
        window.location.href = '/player';
    }, 3000);
});

socket.on('roomFound', () => {
    $('#checking-room').html('Waiting for host to start game!!');
});

socket.on('alreadyStart', () => {
    $('#checking-room').html('Game already started!');
    setTimeout(() => {
        window.location.href = '/player';
    }, 3000);
})

sessionStorage.setItem("question_index", "-1");

socket.on("playerInfo", (player) => {
    sessionStorage.setItem(`profile`, JSON.stringify(player));
})

socket.on('updatePlayerList', (players) => {
    $("#players-number").html(players.length);
    $('#playerList').html('');
    for (let i = 0; i < players.length; i++) {
        $('#playerList').append($("<div class='col-md-4 py-2'><p>" + players[i].name + "</p></div>"));
    }
});
socket.on("redirect-to-question", () => {
    window.location.replace('/player/new_game');
})

socket.on('disconnect', function() {
    console.log('disconnected from server.');
})

socket.on('roomCanceled', () => {
    window.location.replace('/player');
})

socket.on('connect', () => {
    socket.emit('player-join', info);
})

sessionStorage.setItem("localPin", info.pin);