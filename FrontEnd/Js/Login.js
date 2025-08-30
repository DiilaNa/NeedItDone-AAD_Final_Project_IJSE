
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
            alert("Failed to login");
            return;
        }

        const resp = await response.json();
        const token = resp.data.accessToken;

        if (!token) {
            window.location.href = "../Pages/HomePage.html";
            return;
        }

        const userID = resp.data.userId
        console.log(userID)
        localStorage.setItem("token", token);
        localStorage.setItem("userID",userID)

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


