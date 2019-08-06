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
            $(`#answer_point`).html("+ 0 .pt")
        }
        // Update player's info in nav-bar
        $('#navPin').html("PIN: " + updatedPlayer.roomId);
        $('#playerName').html(updatedPlayer.name);
        $('#pointBox').addClass('border border-dark');
        $('#point').html(updatedPlayer.score + " .pt");
    })
} else {
    $('#navPin').html("PIN: " + sessionStorage.getItem("localPin"));
    $(`#answer_status`).html("Correct Answer:").attr("style", "font-size:30px;")
    if (window.sessionStorage.getItem("correct_answer") == 1) {
        $(`#answer_point`).html("A").attr("style", "font-size:60px;")
    } else if (window.sessionStorage.getItem("correct_answer") == 2) {
        $(`#answer_point`).html("B").attr("style", "font-size:60px;")
    } else if (window.sessionStorage.getItem("correct_answer") == 3) {
        $(`#answer_point`).html("C").attr("style", "font-size:60px;")
    } else if (window.sessionStorage.getItem("correct_answer") == 4) {
        $(`#answer_point`).html("D").attr("style", "font-size:60px;")
    }
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