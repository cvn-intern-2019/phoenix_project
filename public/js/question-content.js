socket.emit("getQuestion", window.sessionStorage.getItem("localPin"));
let player = JSON.parse(sessionStorage.getItem("profile"));
if (player) {
    $('#navPin').html("PIN: " + player.roomId);
    $('#playerName').html(player.name);
    $('#pointBox').addClass('border border-dark');
    $('#point').html(player.score + " .pt");
} else {
    $('#navPin').html("PIN: " + sessionStorage.getItem("localPin"));
}
socket.on("question-content", (question, index) => {
    $("#question-content").html(question.question_content);
    if (parseInt(sessionStorage.getItem("question_index")) < index) {
        sessionStorage.setItem("question_index", index);
    } else {
        setTimeout(() => {
            socket.emit('hostDisconnect', window.sessionStorage.getItem("localPin"));
        }, 3500);
    }
})

socket.on("roomDisconnected", () => {
    window.sessionStorage.clear();
    window.location.replace("/error");
})

socket.on("final-statistic", () => {
    window.location.replace('/player/final-stat');
})

function disableF5(e) { if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault(); };

$(document).ready(function() {
    $(document).on("keydown", disableF5);
});
var timeleft = 4;
var downloadTimer = setInterval(function() {
    document.getElementById("time_question").innerHTML = timeleft;
    timeleft -= 1;
    if (timeleft < 0) {
        clearInterval(downloadTimer);
        window.location.replace("/player/question");
    }
}, 1000);