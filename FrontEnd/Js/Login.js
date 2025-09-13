/*--------Navigate to SignUp Page--------------*/
function navigateTo(page) {
    if (page==='register'){
        window.location.href="SignUpPage.html"
    }
}

/*--------------------------LOGIN--------------------------------*/
$("#loginForm").on('submit', function(e) {
    e.preventDefault();
    LogIn();
});


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
            const errorResp = await response.json();
            const loginError = document.getElementById("loginError");
            loginError.style.display = "block";
            loginError.innerText = errorResp.message || "Login Failed.";
            setTimeout(() => loginError.classList.remove("visible"), 5000);
            return;
        }

        const resp = await response.json();
        const token = resp.data.accessToken;
        const AccountStatus = resp.data.status

        if (AccountStatus !== 'ACTIVE' ){
            const loginError = document.getElementById("loginError");
            loginError.style.display = "block";
            loginError.innerText = "Your account is disabled.";
            setTimeout(() => loginError.classList.remove("visible"), 5000);
            return;
        }

        if (!token) {
            window.location.href = "../Pages/HomePage.html";
            return;
        }

        const userID = resp.data.userId
        const role = resp.data.role;
        localStorage.setItem("role", role);
        localStorage.setItem("token", token);
        localStorage.setItem("userID",userID)
        localStorage.setItem("refreshToken", resp.data.refreshToken);

        await redirectBasedOnRole(token);

    } catch (error) {
        console.error("Login error:", error);
        alert("Something went wrong!");
    }
}

async function redirectBasedOnRole(token) {

    let res = await fetchWithRefresh("http://localhost:8080/hello/homeowner", {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    if (res.ok) {
        window.location.href = "../Pages/HomeOwnerDashBoard.html";
        return;
    }


    res = await fetchWithRefresh("http://localhost:8080/hello/worker", {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    if (res.ok) {
        window.location.href = "../Pages/WorkersDashBoard.html";
        return;
    }


    res = await fetchWithRefresh("http://localhost:8080/hello/admin", {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    if (res.ok) {
        window.location.href = "../Pages/Admin.html";
        return;
    }

    alert("Access denied: No role match");
}

async function fetchWithRefresh(url, options = {}) {
    let token = localStorage.getItem("token");
    let refreshToken = localStorage.getItem("refreshToken");

    if (!options.headers) options.headers = {};
    options.headers["Authorization"] = "Bearer " + token;

    let res = await fetch(url, options);

    if (res.status === 401 || res.status === 403) {
        const refreshRes = await fetch("http://localhost:8080/auth/refresh-token", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken })
        });

        if (refreshRes.ok) {
            const data = await refreshRes.json();
            localStorage.setItem("token", data.accessToken);

            options.headers["Authorization"] = "Bearer " + data.accessToken;
            res = await fetch(url, options);
        } else {
            localStorage.clear();
            window.location.href = "../Pages/LogIn.html";
        }
    }

    return res;
}


/*----------------------Password Toggle Button----------------------*/
$("#togglePassword").on("click", function () {
    const input = $("#passWORD");
    const icon = $(this).find("i");

    if (input.attr("type") === "password") {
        input.attr("type", "text");
        icon.removeClass("bi-eye").addClass("bi-eye-slash");
    } else {
        input.attr("type", "password");
        icon.removeClass("bi-eye-slash").addClass("bi-eye");
    }
});

/*--------------------------- Open modal-----------------------------------*/
$("#forgotPasswordLink").on("click", function(e){
    e.preventDefault();
    $("#forgotPasswordModal").modal("show");
});


/*------------------Google SIgnIN-------------------------------------*/
function handleGoogleLogin(response) {
    $.ajax({
        url: "http://localhost:8080/auth/google-login",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ token: response.credential }),
        success: function(res) {
            localStorage.setItem("token", res.token);
            localStorage.setItem("userID", res.userId);

            if (!res.role) {
                // Show role selection modal
                $("#roleModal").modal("show");

                $("#homeownerBtn").off("click").on("click", function() {
                    assignRole("HOMEOWNER", res.userId);
                });
                $("#workerBtn").off("click").on("click", function() {
                    assignRole("WORKER", res.userId);
                });

            } else {
                redirectByRole(res.role);
            }
        },
        error: function(err) {
            console.error(err);
            alert("Google login failed");
        }
    });
}
function assignRole(role, userId) {
    $.ajax({
        url: "http://localhost:8080/auth/user/assign-role",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify({ role: role, userId: userId }),
        success: function(res) {
            $("#roleModal").modal("hide");
            redirectByRole(role);
        },
        error: function(err) {
            console.error(err);
            alert("Failed to assign role");
        }
    });
}
function redirectByRole(role) {
    if (role === "HOMEOWNER") {
        localStorage.setItem("role","HOMEOWNER")
        window.location.href = "../Pages/HomeOwnerDashBoard.html";
    } else if (role === "WORKER") {
        localStorage.setItem("role","WORKER")
        window.location.href = "../Pages/WorkersDashBoard.html";
    } else {
        alert("Unknown role");
    }
}








