// Get list of player's score 
let player = JSON.parse(sessionStorage.getItem("profile"));
if (player) {
    $('#navPin').html("PIN: " + player.roomId);
    $('#playerName').html(player.name);
    $('#pointBox').addClass('border border-dark');
    $('#point').html(player.score + " .pt");
} else {
    $('#navPin').html("PIN: " + sessionStorage.getItem("localPin"));
}
socket.emit("listPlayerScoreRequest", window.sessionStorage.getItem("localPin"));
socket.on("listPlayerScoreReponse", (listPlayer) => {
    if (listPlayer[0]) {
        $('#player1').text(listPlayer[0].name);
    }
    if (listPlayer[1]) {
        $('#player2').text(listPlayer[1].name);
    }
    if (listPlayer[2]) {
        $('#player3').text(listPlayer[2].name);
    }
});

$('#quitBtn').click(() => {
    if (player) {
        window.sessionStorage.clear();
        window.location.replace('/player');
    } else {
        socket.emit("deletePlayer", window.sessionStorage.getItem("localPin"));
        window.location.replace('/host/questionset');
    }
});

$("body").addClass('homepage-bg');

$('#rank2').animate({ height: "70%" }, 1000);
$('#rank1').animate({ height: "80%" }, 1000);
$('#rank3').animate({ height: "65%" }, 1000);
$('.text1').fadeIn(4000);
$('.text2').fadeIn(4000);
$('.text3').fadeIn(4000);