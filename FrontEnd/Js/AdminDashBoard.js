$(document).ready(function() {
    checkToken();
    sideNavBar();
    loadUsers();
    loadJobs();
    loadAdminDashboardStats();

});
function checkToken() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
        window.location.href = "../Pages/LogIn.html";
    }
    if (role !== "ADMIN") {
        window.location.href = "../Pages/LogIn.html";
        return;
    }
}

/*-------------------------Get Count Dashboard-----------------------------*/
function loadAdminDashboardStats() {
   ajaxWithRefresh({
        url: "http://localhost:8080/admin/dashboard-stats",
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            if (res.status === 200 && res.data) {
                $("#total-users").text(res.data.totalUsers);
                $("#active-jobs").text(res.data.activeJobs);
                $("#completed-jobs").text(res.data.completedJobs);
            }
        },
        error: function (err) {
            console.error("Failed to load dashboard stats", err);
        }
    });
}



/*----------------------SIDE NAV BAR-------------------------------------------*/

function sideNavBar() {
    var $circleMenuBtn = $('#circleMenuBtn');
    var $hamburgerIcon = $('#hamburgerIcon');
    var $sideNav = $('#sideNav');
    var $navBackdrop = $('#navBackdrop');


    $circleMenuBtn.on('click', function() {
        if ($sideNav.hasClass('show')) {
            $sideNav.removeClass('show');
            $navBackdrop.removeClass('show');
            $hamburgerIcon.removeClass('active');
            $circleMenuBtn.removeClass('active');
        } else {
            $sideNav.addClass('show');
            $navBackdrop.addClass('show');
            $hamburgerIcon.addClass('active');
            $circleMenuBtn.addClass('active');
        }
    });

    $navBackdrop.on('click', function() {
        $sideNav.removeClass('show');
        $navBackdrop.removeClass('show');
        $hamburgerIcon.removeClass('active');
        $circleMenuBtn.removeClass('active');
    });

    $('.nav-menu a').on('click', function() {
        if ($(window).width() <= 991) {
            $sideNav.removeClass('show');
            $navBackdrop.removeClass('show');
            $hamburgerIcon.removeClass('active');
            $circleMenuBtn.removeClass('active');
        }
    });

}

/*---------------------SIGN OUT Button---------------------------*/
$("#logoutBTN").on('click',function () {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role")
    window.location.href = "../Pages/HomePage.html";
})

/*-------------------------LOAD ALL USER DETAILS----------------------------------------------*/
let currentPage = 0;
const pageSize = 10;

function loadUsers(page = 0) {
    currentPage = page
    ajaxWithRefresh({
        url: `http://localhost:8080/admin/getAllUserPagination?page=${page}&size=${pageSize}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            if (res.status === 200) {
                const users = res.data.content;
                const tbody = $("#userTableBody");
                tbody.empty();
                users.forEach(user => {
                    tbody.append(`
                        <tr>
                            <td>${user.username}</td>
                            <td>${user.role}</td>
                            <td>${user.email}</td>
                            <td>${new Date(user.joinDate).toLocaleDateString()}</td>
                         
                            <td>
                                 <button class="btn btn-sm ${user.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'} disable-btn" data-id="${user.id}">
                                        ${user.status === 'ACTIVE' ? "Disable" : "Enable"}
                                </button>
                            </td>
                        </tr>
                    `);
                });

                /* <td>
                              <span class="badge ${user.active ? 'bg-success' : 'bg-danger'}">
                                  ${user.active ? 'Active' : 'Inactive'}
                              </span>
                          </td>*/

                // pagination
                renderPagination(res.data.totalPages, page);
            }
        },
        error: function (err) {
            console.error("Failed to load users", err);
        }
    });
}

function renderPagination(totalPages, current) {
    const container = $("#paginationControls");
    container.empty();

    // Prev link
    container.append(`
        <span class="pagination-link me-3 ${current === 0 ? 'disabled' : ''}"
            onclick="${current > 0 ? `loadUsers(${current - 1})` : ''}">
            ⬅ Prev
        </span>
    `);

    // Current page indicator
    container.append(`
        <span class="pagination-info me-3">
            Page ${current + 1} of ${totalPages}
        </span>
    `);

    // Next link
    container.append(`
        <span class="pagination-link ${current === totalPages - 1 ? 'disabled' : ''}"
            onclick="${current < totalPages - 1 ? `loadUsers(${current + 1})` : ''}">
            Next ➡
        </span>
    `);
}

/*-----------------Set Account Status / Disable or Enable Account----------------------------*/
$(document).on("click", ".disable-btn", function () {
    const userId = $(this).data("id");
    const button = $(this);
    console.log(userId)

    ajaxWithRefresh({
        url: `http://localhost:8080/admin/disableUser/${userId}`,
        type: "PUT",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            alert(res.message || "User disabled successfully!");
            loadUsers(currentPage);
        },
        error: function (err) {
            console.error("Failed to disable user", err);
            alert("Error disabling user");
        }
    });
});

/*--------------------------Search By Keyword------------------------------------------*/
$("#userSearch").on("keyup", function () {
    const keyword = $(this).val().trim();

    if (keyword === "") {
        loadUsers(0);
        return;
    }

    ajaxWithRefresh({
        url: `http://localhost:8080/admin/search/${keyword}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const users = res.data;
            const tbody = $("#userTableBody");
            tbody.empty();

            users.forEach(user => {
                tbody.append(`
                    <tr>
                        <td>${user.username}</td>
                        <td>${user.role}</td>
                        <td>${user.email}</td>
                        <td>${new Date(user.joinDate).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-sm btn-danger disable-btn" data-id="${user.id}">
                                ${user.status === 'ACTIVE' ? "Disable" : "Enable"}
                            </button>
                        </td>
                    </tr>
                `);
            });

            $("#paginationControls").empty();
        },
        error: function (err) {
            console.error("User search failed", err);
        }
    });
});
/*-------------------------LOAD ALL JOB POSTS----------------------------------------------*/
let currentJobPage = 0;
const jobPageSize = 10;

function loadJobs(page = 0) {
    currentJobPage = page;
    ajaxWithRefresh({
        url: `http://localhost:8080/admin/getAllJobPostsPagination?page=${page}&size=${jobPageSize}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            if (res.status === 200) {
                const jobs = res.data.content;
                const tbody = $("#jobTableBody");
                tbody.empty();

                jobs.forEach(job => {
                    tbody.append(`
                        <tr>
                            <td>${job.jobTitle}</td>
                            <td>${job.username || 'N/A'}</td>
                            <td>${job.description}</td>
                            <td>${job.location}</td>
                            <td>${job.urgency}</td>
                            <td>${job.postedDate ? new Date(job.postedDate).toLocaleDateString() : 'N/A'}</td>
                            <td>
                               <button class="btn btn-sm ${job.jobPostVisibility  === 'ENABLE' ? 'btn-danger' : 'btn-success'} disable-job-btn" data-id="${job.id}">
                                      ${job.jobPostVisibility  === 'ENABLE' ? "Disable" : "Enable"}
                                </button>
                            </td>

                        </tr>
                    `);
                });

                renderJobPagination(res.data.totalPages, page);
            }
        },
        error: function (err) {
            console.error("Failed to load jobs", err);
        }
    });
}

function renderJobPagination(totalPages, current) {
    const container = $("#jobPaginationControls");
    container.empty();

    container.append(`
        <span class="pagination-link me-3 ${current === 0 ? 'disabled' : ''}"
            onclick="${current > 0 ? `loadJobs(${current - 1})` : ''}">
            ⬅ Prev
        </span>
        <span class="pagination-info me-3">
            Page ${current + 1} of ${totalPages}
        </span>
        <span class="pagination-link ${current === totalPages - 1 ? 'disabled' : ''}"
            onclick="${current < totalPages - 1 ? `loadJobs(${current + 1})` : ''}">
            Next ➡
        </span>
    `);
}
/*-----------------Disable Job Post----------------------------*/
$(document).on("click", ".disable-job-btn", function () {
    const jobId = $(this).data("id");

    ajaxWithRefresh({
        url: `http://localhost:8080/admin/disableJob/${jobId}`,
        type: "PUT",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            alert(res.message || "Job disabled successfully!");
            loadJobs(currentJobPage);
        },
        error: function (err) {
            console.error("Failed to disable job", err);
            alert("Error disabling job");
        }
    });
});

/*--------------------------Search Jobs------------------------------------------*/
$("#jobSearchAdmin").on("keyup", function () {
    const keyword = $(this).val().trim();

    if (keyword === "") {
        loadJobs(0);
        return;
    }

    ajaxWithRefresh({
        url: `http://localhost:8080/admin/searchJobs/${keyword}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const jobs = res.data;
            const tbody = $("#jobTableBody");
            tbody.empty();

            jobs.forEach(job => {
                tbody.append(`
                    <tr>
                        <td>${job.jobTitle}</td>
                        <td>${job.users?.username || 'N/A'}</td>
                        <td>${job.description}</td>
                        <td>${job.location}</td>
                        <td>${job.urgency}</td>
                        <td>${new Date(job.postedDate).toLocaleDateString()}</td>
                        <td>
                            <button class="btn btn-sm btn-danger disable-job-btn" data-id="${job.id}">
                                Disable
                            </button>
                        </td>
                    </tr>
                `);
            });

            $("#jobPaginationControls").empty();
        },
        error: function (err) {
            console.error("Job search failed", err);
        }
    });
});

function ajaxWithRefresh(options) {
    const token = localStorage.getItem("token");

    // Add Authorization header
    if (!options.headers) options.headers = {};
    options.headers.Authorization = "Bearer " + token;

    const originalError = options.error;

    options.error = async function(xhr, status, error) {
        if (xhr.status === 401 || xhr.status === 403) {
            // silently handle token expiration
            const refreshToken = localStorage.getItem("refreshToken");
            try {
                const res = await fetch("http://localhost:8080/auth/refresh-token", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ refreshToken })
                });
                if (res.ok) {
                    const data = await res.json();
                    localStorage.setItem("token", data.accessToken);

                    // retry the original request silently
                    options.headers.Authorization = "Bearer " + data.accessToken;
                    $.ajax(options);
                } else {
                    localStorage.clear();
                    window.location.href = "../Pages/LogIn.html";
                }
            } catch (err) {
                localStorage.clear();
                window.location.href = "../Pages/LogIn.html";
            }
        } else {
            if (originalError) originalError(xhr, status, error);
        }
    };


    $.ajax(options);
}







