let socket = io({ transports: ['websocket'], upgrade: false });
let roomPin = '';
socket.emit('create_room', data);
socket.on('waiting-room', (pin) => {
    $('#pin').html(pin);
    socket.emit('host-join', pin);
    roomPin = pin;
    sessionStorage.setItem("localPin", roomPin);
})

socket.on('updatePlayerList', players => {
    $("#players-number").html(players.length);
    $('#playerList').html('');
    if (players.length <= 0) {
        $('#host_start').attr("disabled", "disabled");
    } else {
        $('#host_start').removeAttr('disabled');
    }
    for (let i = 0; i < players.length; i++) {
        $('#playerList').append($("<div class='col-md-4 py-2'><p>" + players[i].name + "</p></div>"));
    }

})

function disableF5(e) { if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault(); };
$(document).ready(function() {
    $(document).on("keydown", disableF5);
});

$("#host_start").click(() => {
    $("#host_start").attr('disabled', 'disabled');
    socket.emit("start-game", roomPin);
})
sessionStorage.setItem("question_index", "-1");

$('#host_back').click(() => {
    socket.emit("deletePlayer", window.sessionStorage.getItem("localPin"));
    window.location.replace('/host/questionset');
    socket.emit("cancelRoom", window.sessionStorage.getItem("localPin"));
})

socket.on("redirect-to-question", () => {
    window.location.replace('/player/new_game');
})