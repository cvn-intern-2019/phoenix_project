$(document).ready(() => {
    $( "#signUpForm" ).validate({
        errorClass : 'my-error-class',
        rules: {
            username: {
            required: true
            },
            password : {
                required : true
            },
            confirmPassword : {
                required : true,
                equalTo: "#password"
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
            required: true
            },
            password : {
                required : true
            },
            confirmPassword : {
                required : true
            },
            email : {
                required : true,
                email : true
            }
        }
    });
});