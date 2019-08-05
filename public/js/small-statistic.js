let player = JSON.parse(window.sessionStorage.getItem("profile"));
if (player) {
    socket.emit("updateProfile", player.id);
    socket.on("updatedProfile", (profile) => {
        // Get player status after answer question
        window.sessionStorage.setItem("profile", JSON.stringify(profile));
        updatedPlayer = JSON.parse(window.sessionStorage.getItem("profile"));
        if (player.score < updatedPlayer.score) {
            $(`#answer_point`).html("+ " + (parseInt(updatedPlayer.score) - parseInt(player.score)) + " .pt");
            $(`#answer_status`).html("Correct !")
        } else {
            $(`#answer_result`).removeClass("bg-success").addClass('bg-danger');
            $(`#answer_status`).html("Incorrect !")
            if(window.sessionStorage.getItem("correct_answer") == 1){
                $(`#answer_correct`).html("Correct_answer : A");
            }
            if(window.sessionStorage.getItem("correct_answer") == 2){
                $(`#answer_correct`).html("Correct_answer : B");
            }
            if(window.sessionStorage.getItem("correct_answer") == 3){
                $(`#answer_correct`).html("Correct_answer : C");
            }
            if(window.sessionStorage.getItem("correct_answer") == 4){
                $(`#answer_correct`).html("Correct_answer : D");
            }
        }
        // Update player's info in nav-bar
        $('#navPin').html("PIN: " + updatedPlayer.roomId);
        $('#playerName').html(updatedPlayer.name);
        $('#pointBox').addClass('border border-dark');
        $('#point').html(updatedPlayer.score + " .pt");
    })
} else {
    $('#navPin').html("PIN: " + sessionStorage.getItem("localPin"));
}

function disableF5(e) { if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault(); };

$(document).ready(function() {
    $(document).on("keydown", disableF5);
});
// Show players' score list
socket.emit("listPlayerScoreRequest", window.sessionStorage.getItem("localPin"));
socket.on("listPlayerScoreReponse", (listPlayer) => {
    for (let i = 0; i < listPlayer.length; i++) {
        $("#list-score").append(
            '<li>' +
            '<span class="ml-4 font-weight-bold" style="font-size: 20px;">' + listPlayer[i].name + '</span>' +
            '<span class="ml-4 font-weight-bold float-right" style="font-size: 20px;" id="">' + listPlayer[i].score + ' .pt</span>' +
            '</li>');
    }
});

// Handle UI
$("body").addClass('homepage-bg');
var sec = 2;
$('#countdown').css({
    fontSize: 30
});
var timer = setInterval(function() {
    $('#countdown').text(sec--);
    if (sec < 3) {
        $('#countdown').addClass("text-danger");
        $('#countdown').addClass("text-warning");
    }
    if (sec == -1) {
        clearInterval(timer);
        window.location.replace("/player/new_game");
    }
}, 1000);