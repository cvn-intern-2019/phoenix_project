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

    jQuery.validator.addMethod("specialChars", function( value, element ) {
        var regex = new RegExp("^[a-zA-Z0-9]+$");
        var key = value;

        if (!regex.test(key)) {
            return false;
        }
        return true;
    }, "please use only alphanumeric or alphabetic characters");
});