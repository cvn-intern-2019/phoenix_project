$(document).ready(() => {
    $( "#signUpForm" ).validate({
        errorClass : 'my-error-class',
        rules: {
            username: {
                required: true,
                minlength: 5,
                specialChars : true
            },
            password : {
                required : true,
                minlength: 7
            },
            confirmPassword : {
                required : true,
                equalTo: "#password",
                minlength: 7
            },
            email : {
                required : true,
                email : true
            }
        }
    });

    $( "#signInForm" ).validate({
        errorClass : 'my-error-class',
        rules: {
            username: {
                required: true,
                minlength: 5,
                specialChars : true
            },
            password : {
                required : true,
                minlength: 7
            }
        }
    });

    $( "#editProfileForm" ).validate({
        errorClass : 'my-error-class',
        rules: {
            email : {
                required : true,
                email : true
            }
        }
    });

    $( "#changePassForm" ).validate({
        errorClass : 'my-error-class',
        rules: {
            current:{
                required : true,
                minlength: 7
            },
            new : {
                required : true,
                minlength: 7
            },
            confirm : {
                required : true,
                minlength: 7
            }
        }
    });

<<<<<<< HEAD
    $( "#question" ).validate({
        errorClass : 'my-error-class',
        rules: {
            answer1:{
                required : true,
            },
            answer2 : {
                required : true,
            },
            answer3 : {
                required : true,
            },
            answer4 : {
                required : true,
            },
            content : {
                required : true,
            },
            correctanswer : {
                required : true,
            },
=======
    $( "#create_question" ).validate({
        errorClass : 'my-error-class',
        rules: {
            content:{
                required : true,
            },
            answer1 : {
                required : true,
                maxlength: 50,
            },
            answer2 : {
                required : true,
                maxlength: 50,
            },
            answer3 : {
                required : true,
                maxlength: 50,
            },
            answer4 : {
                required : true,
                maxlength: 50,
            },
            correctanswer : {
                required : true,
                maxlength: 1,
            }
>>>>>>> e84013bea81578ee3c6210f84475de4b17a04188
        }
    });

    jQuery.validator.addMethod("specialChars", function( value, element ) {
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var key = value;

        if (!regex.test(key)) {
            return false;
        }
        return true;
    }, "please use only alphanumeric or alphabetic characters");
});