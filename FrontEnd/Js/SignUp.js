/*--------Navigate to SignUp Page--------------*/
function navigateTo(page) {
    if (page==='login'){
        window.location.href="LogIn.html"
    }
}

/*--------------Sign Up----------------------------*/
$("#signUpForm").on('submit', function(e) {
    e.preventDefault();

    const username = $("#userName").val();
    const email = $("#email").val();
    const contact = $("#contact").val();
    const password = $("#password").val();
    const conPass = $("#confirmPassword").val();

    if (password !== conPass){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Password Do not Match!",
        });
        return;
    }

    // Store form data temporarily
    localStorage.setItem("tmpSignUpData",
        JSON.stringify({
            username,
            email,
            contact,
            password
        }));

    // Show modal to choose role
    var roleModal = new bootstrap.Modal(document.getElementById('roleModal'));
    roleModal.show();
});

// Handle role selection
$("#homeownerBtn").click(function() {
    submitSignUp("HOMEOWNER");
});

$("#workerBtn").click(function() {
    submitSignUp("WORKER");
});

function submitSignUp(selectedRole) {
    const formData = JSON.parse(localStorage.getItem("tmpSignUpData"));

    const data = {
        username: formData.username,
        email: formData.email,
        phone: formData.contact,
        password: formData.password,
        role: selectedRole
    };

    $.ajax({
        url: 'http://localhost:8080/auth/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'User registered successfully!',
                background: '#2c2c2c',
                color: '#ffffff',
                confirmButtonColor: '#32e1b6'
            }).then(() => {
                localStorage.removeItem("tmpSignUpData"); // clean up
                window.location.href = "../Pages/LogIn.html";
            });
        },
        error: function (xhr) {
            Swal.fire({
                icon: 'error',
                title: 'Registration Failed',
                background: '#2c2c2c',
                color: '#ffffff',
                confirmButtonColor: '#32e1b6'
            });
        }
    });

    // Hide modal after selection
    var roleModalEl = document.getElementById('roleModal');
    var modal = bootstrap.Modal.getInstance(roleModalEl);
    modal.hide();
}
/*----------------------PassWord Toggle------------------------*/
$(".togglePassword").on("click",function () {
    const input = $("#password");
    const icon = $(this).find("i");

    if (input.attr("type")=== "password"){
        input.attr("type","text");
        icon.removeClass("bi-eye").addClass("bi-eye-slash");
    }else {
        input.attr("type","password");
        icon.removeClass("bi-eye-slash").addClass("bi-eye");
    }
})

