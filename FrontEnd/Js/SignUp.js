/*--------Navigate to SignUp Page--------------*/
function navigateTo(page) {
    if (page==='login'){
        window.location.href="LogIn.html"
    }
}

/*--------------Sign Up----------------------------*/

$("#signUpBTN").on('click',function () {
    SignUp();
    console.log("clicked sign up")
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
    console.log(data)
    $.ajax({
        url:'http://localhost:8080/auth/register',
        method:'Post',
        contentType:'application/json',
        data:JSON.stringify(data),
        success: function (response) {
            alert("Success")
            console.log("success")
            window.location.href="../Pages/LogIn.html"
        },
        error:function (x) {
            console.log("failed")
            alert("signUp Failed")
        }
    });

}