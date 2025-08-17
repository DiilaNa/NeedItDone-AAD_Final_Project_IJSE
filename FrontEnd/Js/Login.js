/*---------------------------------[[]]]]*/

$("#loginBtn").on('click', function(e) {
    e.preventDefault();
    window.location.href = "../Pages/HomeOwnerDashBoard.html";
});

/*--------Navigate to SignUp Page--------------*/

function navigateTo(page) {
    if (page==='register'){
        window.location.href="SignUpPage.html"
    }
}

/*--------------------------LOGIN--------------------------------*/

$("#loginForm").on('submit', function(e) {
    e.preventDefault();
   /* LogIn();*/
});

/*function LogIn() {
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
}*/

async function LogIn() {
    const username = document.getElementById("userNAME").value;
    const password = document.getElementById("passWORD").value;

    const data = {
        username: username,
        password: password
    };

    try {
        const response = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            alert("Failed to login");
            return;
        }

        const resp = await response.json();
        const token = resp.data.accessToken;

        if (!token) {
            window.location.href = "../Pages/HomePage.html";
            return;
        }

        localStorage.setItem("token", token);

        await redirectBasedOnRole(token);

    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong!");
    }
}

async function redirectBasedOnRole(token) {

    let res = await fetch("http://localhost:8080/hello/homeowner", {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    if (res.ok) {
        window.location.href = "../Pages/HomeOwnerDashBoard.html";
        return;
    }


    res = await fetch("http://localhost:8080/hello/worker", {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    if (res.ok) {
        window.location.href = "../Pages/WorkersDashBoard.html";
        return;
    }


    res = await fetch("http://localhost:8080/hello/admin", {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    if (res.ok) {
        window.location.href = "../Pages/Admin.html";
        return;
    }

    alert("Access denied: No role match");
}


