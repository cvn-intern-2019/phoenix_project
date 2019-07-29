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
        }
    });

    $("#questionset").validate({
        rules: {
          title: {
            required: true,
            minlength: 5,
            maxlength: 50,
            //digits: true
          },
          description: {
            required: true,
            minlength: 10,
            maxlength: 100,
          },
        },
        messages: {
          title: {
            required: " * Please enter title of question set * ",
            minlength: " * Title must be at least 5 characters * ",
            maxlength: " * Title does not exceed 100 characters * ",
          },
          description: {
            required: " * Please enter desctiption of question set * ",
            minlength: " * Desctiption must be at least 10 characters * ",
            maxlength: " * Desctiption does not exceed 100 characters * ",
          },
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