function apiRequest(options) {
    const accessToken = localStorage.getItem("accessToken");

    $.ajax({
        ...options,
        headers: {
            Authorization: "Bearer " + accessToken,
            ...(options.headers || {})
        },
        error: function (xhr) {
            if (xhr.status === 401) {
                refreshAccessToken().then(success => {
                    if (success) {
                        apiRequest(options);
                    } else {
                        localStorage.clear();
                        window.location.href = "../Pages/LogIn.html";
                    }
                });
            } else {
                if (options.error) options.error(xhr);
            }
        }
    });
}
