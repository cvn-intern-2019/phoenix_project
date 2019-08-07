let answer = 0;
let answerTime = 0;
var start = Date.now();
let player = JSON.parse(sessionStorage.getItem(`profile`));
if (player) {
    // Update player's info in nav-bar
    $('#navPin').html("PIN: " + player.roomId);
    $('#playerName').html(player.name);
    $('#pointBox').addClass('border border-dark');
    $('#point').html(player.score + " .pt");
} else {
    $('#navPin').html("PIN: " + sessionStorage.getItem("localPin"));
}
if (!player) {
    // If it is host
    disableAnswerBtn();
}

$("#ans1").click(() => {
    answer = 1;
    disableAnswerBtn();
    answerTime = getAnswerTime(start);
});
$("#ans2").click(() => {
    answer = 2;
    disableAnswerBtn();
    answerTime = getAnswerTime(start);
});
$("#ans3").click(() => {
    answer = 3;
    disableAnswerBtn();
    answerTime = getAnswerTime(start);
});
$("#ans4").click(() => {
    answer = 4;
    disableAnswerBtn();
    answerTime = getAnswerTime(start);
});

// Handle countdown
var sec = 14;
$('#countdown').css({
    fontSize: 40
});
$('#countdown').css("font-weight", "bold");
var timer = setInterval(function() {
    $('#countdown').text(sec--);
    if (sec < 10) {
        $('#countdown').addClass("text-warning");
        $('#countdown').addClass("text-success");
    }
    if (sec < 5) {
        $('#countdown').addClass("text-danger");
        $('#countdown').addClass("text-warning");
    }
    if (sec <= -1) {
        if (player) {
            player.answer = answer;
            player.answerTime = answerTime;
            sessionStorage.setItem(`profile`, JSON.stringify(player));
            socket.emit("thisIsMyAnswer", player, sessionStorage.getItem("correct_answer"));
        } else {
            // only host
            socket.emit("nextQuestion", window.sessionStorage.getItem("localPin"));
        }
        $('#countdown').fadeOut('slow');
        clearInterval(timer);
        window.location.replace("/player/small-statistic");
    }
}, 1000);


socket.on("roomDisconnected", () => {
    window.sessionStorage.clear();
    window.location.replace("/error");
})

// send get question command
socket.emit("getQuestion", window.sessionStorage.getItem("localPin"));

// Get question content
socket.on("question-content", (question, index) => {
    // Show question-content
    $('#question-content').html(question.question_content);
    sessionStorage.setItem("correct_answer", question.question_answercorrect);

    if (question.question_image !== '')
        $('#question-image').attr('src', '/img/' + question.question_image);
    $('#question-answer1').html(question.question_answer1);
    $('#question-answer2').html(question.question_answer2);
    $('#question-answer3').html(question.question_answer3);
    $('#question-answer4').html(question.question_answer4);
})

function disableAnswerBtn() {
    $("#ans1").attr("disabled", true);
    $("#ans2").attr("disabled", true);
    $("#ans3").attr("disabled", true);
    $("#ans4").attr("disabled", true);
}

function disableF5(e) { if ((e.which || e.keyCode) == 116 || (e.which || e.keyCode) == 82) e.preventDefault(); };

$(document).ready(function() {
    $(document).on("keydown", disableF5);
});

function getAnswerTime(start) {
    return Math.floor((Date.now() - start) / 1000);
}
