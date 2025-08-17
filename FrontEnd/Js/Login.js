$(document).ready(function() {

});

/*--------Navigate to SignUp Page--------------*/

function navigateTo(page) {
    if (page==='register'){
        window.location.href="SignUpPage.html"
    }
}

/*--------------------------LOGIN--------------------------------*/

$("#loginBtn").on('click', function(e) {
    e.preventDefault();
    LogIn();
});

function LogIn() {
    var username = $("#userNAME").val();
    var password = $("#passWORD").val();

    const data = {
        username:username,
        password:password
    }

    $.ajax({
        url:'http://localhost:8080/auth/login',
        method:'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: function (resp) {
            const token = resp.data.accessToken
            if (!token){
                window.location.href = "../Pages/HomePage.html"
            }
            localStorage.setItem("token", resp.data.accessToken);

            redirectBasedOnRole(token);

        },
        error:function (x) {
            alert("Failed to login")
        }
    });


}

function redirectBasedOnRole(token) {
    $.ajax({
        url: "http://localhost:8080/hello/user",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        },
        success: function () {
            window.location.href = "../Pages/HomeOwnerDashBoard.html";
        },
        error: function () {
            $.ajax({
                url: "http://localhost:8080/hello/admin",
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token
                },
                success: function () {
                    window.location.href = "../Pages/Admin.html";
                },
                error: function () {
                    alert("Access denied: No role match");
                }
            });
        }
    });
}

