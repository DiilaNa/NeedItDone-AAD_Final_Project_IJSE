$(document).ready(function() {
    sideNavBar();
    loadUsers();
    loadJobs();

});

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
    $.ajax({
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
                                 <button class="btn btn-sm ${user.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'} disable-job-btn" data-id="${user.id}">
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

    $.ajax({
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

/*--------------------------Search Byy Keyword------------------------------------------*/
$("#userSearch").on("keyup", function () {
    const keyword = $(this).val().trim();

    if (keyword === "") {
        loadUsers(0);
        return;
    }

    $.ajax({
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
    $.ajax({
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
                               <button class="btn btn-sm ${job.status === 'ACTIVE' ? 'btn-danger' : 'btn-success'} disable-job-btn" data-id="${job.id}">
                                      ${job.status === 'ACTIVE' ? "Disable" : "Enable"}
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

    $.ajax({
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






