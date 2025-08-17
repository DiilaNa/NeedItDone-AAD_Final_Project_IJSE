/*--------Navigate to SignUp Page--------------*/
function navigateTo(page) {
    if (page==='login'){
        window.location.href="LogIn.html"
    }
}

/*--------------Sign Up----------------------------*/

$("#signUpForm").on('submit',function (e) {
    e.preventDefault();
    SignUp();
});

function SignUp() {
    const username =$("#userName").val();
    const email = $("#email").val();
    const contact = $("#contact").val();
    const password = $("#password").val();
    const conPass = $("#confirmPassword").val()
    const role = "USER"
    if (password !== conPass){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Password Do not Match!",
        });
        return;
    }

    const data={
        username: username,
        email:email,
        phone:contact,
        password:password,
        role: role
    }
    $.ajax({
        url: 'http://localhost:8080/auth/register',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (response) {
            if (response.status === 200){
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'User registered successfully!',
                    background: '#2c2c2c',
                    color: '#ffffff',
                    confirmButtonColor: '#32e1b6'
                }).then(() => {
                    window.location.href = "../Pages/LogIn.html";
                });
            }
        },
        error: function (xhr) {
            const status = xhr.responseJSON.status;
            if (status === 401){
                Swal.fire({
                    icon: 'error',
                    title: 'Token Expired...',
                    background: '#2c2c2c',
                    color: '#ffffff',
                    confirmButtonColor: '#32e1b6'
                });
            }else {
                Swal.fire({
                    icon: 'error',
                    title: 'Internal Server Error...',
                    background: '#2c2c2c',
                    color: '#ffffff',
                    confirmButtonColor: '#32e1b6'
                });

            }
        }
    });

}