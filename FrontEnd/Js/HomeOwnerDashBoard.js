$(document).ready(function () {
    checkToken();
    loadMyJobs();
    loadUserDetails();
    sideNav();
    loadApplications();
    loadRecentJobs();
    loadRecentApplications();
    loadDashboardStats();
    $("#homeowner-my-jobs-content").on("click", ".view-job", function () {
        const jobId = $(this).closest(".job-card").data("id");
        viewJobPostsDetails(jobId);
    });

    $("#homeowner-my-jobs-content").on("click", ".edit-job", function () {
        const jobId = $(this).closest(".job-card").data("id");
        loadsToUpdate(jobId)

    });

    $("#editJobForm").on("submit", function (e) {
        e.preventDefault();
        updateJobPosts()

    });

    $("#homeowner-my-jobs-content").on("click", ".delete-job", function () {
        const jobId = $(this).closest(".job-card").data("id");
        deleteJobPosts(jobId)
    });

});
/*--------------------------Check the token when login to the system------------------*/
function checkToken() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
        window.location.href = "../Pages/LogIn.html";
    }
    if (role !== "HOMEOWNER") {
        window.location.href = "../Pages/LogIn.html";
        return;
    }
}
/*--------------------------Load the recent 2 jobs in Dashboard----------------------*/
function loadRecentJobs() {
    const userID = localStorage.getItem("userID");
    ajaxWithRefresh({
        url: `http://localhost:8080/home/recent/${userID}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const container = $("#recent-jobs-container");
            container.empty();

            if (!res.data || res.data === null) {
                container.append(`
                    <div class="text-center py-4">
                        <i class="fas fa-briefcase fa-2x text-muted mb-2"></i>
                        <p class="text-muted">No recent jobs available</p>
                    </div>
                `);
                return;
            }

            res.data.forEach(job => {
                let badgeText = job.applicationsCount > 0
                    ? `${job.applicationsCount} Applications`
                    : 'In Progress';

                let badgeClass = job.applicationsCount > 0
                    ? 'bg-success'
                    : 'bg-warning text-white';

                let postedText = job.postedDate
                    ? `Posted ${moment(job.postedDate).fromNow()}`
                    : 'Posted Today';

                const jobHtml = `
                    <div class="job-card card mb-2 shadow-sm">
                         <div class="card-body">
                             <h6>${job.jobTitle}</h6>
                             <p class="small text-muted" style="color: white !important;">${postedText}</p>
                             <span class="badge ${badgeClass} status-badge">${badgeText}</span
                         </div>
                    </div>
               `;
                container.append(jobHtml);
            });
        }
    });
}

/*--------------------------Load DashBoard Stats-------------------------------------*/
function loadDashboardStats() {
    const userID = localStorage.getItem("userID");

    ajaxWithRefresh({
        url: `http://localhost:8080/home/stats/${userID}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function(res) {
            const stats = res.data;

            $("#my-jobs-count").text(stats.myJobsCount);
            $("#applications-count").text(stats.applicationsCount);
            $("#completed-jobs-count").text(stats.completedJobsCount);
            $("#active-jobs-count").text(stats.activeJobsCount);
        },
        error: function(err) {
            console.error("Failed to load dashboard stats", err);
        }
    });
}

/*-----------------------Load recent Applications----------------------------------*/
function loadRecentApplications() {
    const userID = localStorage.getItem("userID");
    ajaxWithRefresh({
        url: `http://localhost:8080/home/recent-applications/${userID}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const container = $("#recent-applications-container");
            container.empty();

            if (!res.data || res.data.length === 0) {
                container.append(`
                    <div class="text-center py-4">
                        <i class="fas fa-user-clock fa-2x text-muted mb-2"></i>
                        <p class="text-muted">No recent applications yet</p>
                    </div>
                `);
                return;
            }
            console.log(res.data)
            res.data.forEach(app => {
                const appliedDate = app.date
                    ? new Date(app.date).toLocaleDateString()
                    : "Today";

                const appHtml = `
                    <div class="card mb-2 shadow-sm border-0 rounded-3">
                        <div class="card-body d-flex justify-content-between align-items-center">
                            <div>
                                <h6 class="mb-0">${app.workerName}</h6>
                                <small>${app.jobTitle}</small>
                            </div>
                            <span class="badge bg-info">${appliedDate}</span>
                        </div>
                    </div>
                `;
                container.append(appHtml);
            });
        },
        error: function (err) {
            console.error("Failed to load applications", err);
        }
    });
}
    /*-----------------------Side Navigation Bar--------------------------------*/
function sideNav() {
    let $circleMenuBtn = $('#circleMenuBtn');
    let $hamburgerIcon = $('#hamburgerIcon');
    let $sideNav = $('#sideNav');
    let $navBackdrop = $('#navBackdrop');


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
/* -------------------Post a Job/Save----------------------- */
$("#saveJopPostForm").on('submit',function(e){
    e.preventDefault();
    saveJobPosts();
});

function saveJobPosts() {
    const JobData = {
        jobTitle : $("#jobTitle").val(),
        description : $("#jobDescription").val(),
        cost : parseFloat($("#jobBudget").val()),
        location : $("#jobLocation").val(),
        urgency : $("#jobUrgency").val(),
        deadline : $("#jobDeadline").val(),
        categoryName : $("#jobCategory").val()
    };

    ajaxWithRefresh({
        type: "POST",
        url: "http://localhost:8080/home/saveJob",
        data: JSON.stringify(JobData),
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function () {
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Your work has been saved",
                showConfirmButton: false,
                timer: 1500
            });
            loadMyJobs();
            loadWorkerStats();
        },
        error: function (){
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to Save",
                showConfirmButton: false,
                timer: 1500
            });

        }

    })
}

/*-------------------Load User Details in the UI---------------------------------*/
function loadUserDetails() {
    ajaxWithRefresh({
        url: "http://localhost:8080/home/loadUserDetails",
        type: "GET",
        headers:{
            Authorization: "Bearer " + localStorage.getItem("token")
        },

        success: function (user) {
            $("#profileUserName").val(user.data.username);
            $("#profileEmail").val(user.data.email);
            $("#profilePhone").val(user.data.phone);
        }
    });
}

/*----------------------Update User/Home Owner details----------------------------*/
$("#updateUserForm").on('submit', function(e) {
    e.preventDefault();
    const updatedUser = {
        username: $("#profileUserName").val(),
        email: $("#profileEmail").val(),
        phone: $("#profilePhone").val(),
    };

    ajaxWithRefresh({
        url: "http://localhost:8080/home/updateUserHomeController",
        type: "PUT",
        data: JSON.stringify(updatedUser),
        contentType: "application/json",
        headers: {
            Authorization : "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            if (response.data) {
                localStorage.setItem("token", response.data);
            }
            Swal.fire("Updated!", "Your details have been updated", "success");
            loadMyJobs();
            loadUserDetails()
        },
        error: function (e) {
            Swal.fire(
                "Update Failed!",
                "Updating fields has been Failed!",
                "error"

            )
            e.status
        }
});
});

/*-----------------Load Job Posts-------------------------------------*/
function loadMyJobs() {
    const userID = localStorage.getItem("userID")
   ajaxWithRefresh({
        url: `http://localhost:8080/home/get${userID}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const jobsContainer = $("#homeowner-my-jobs-content .row");
            jobsContainer.empty();

            if (res.data.length === 0) {
                jobsContainer.append(`<p class="text-muted">No job posts found.</p>`);
                return;
            }
            res.data.forEach(job => {
                let badgeText = job.applicationsCount > 0
                    ? `${job.applicationsCount} Applications`
                    : 'In Progress';

                let badgeClass = job.applicationsCount > 0
                    ? (job.urgency === 'In Progress' ? 'bg-warning' : 'bg-success')
                    : 'bg-warning text-white';

                let postedText = job.postedDate
                    ? `Posted ${moment(job.postedDate).fromNow()}`
                    : 'Posted Today';

                const cardHtml = `
                            <div class="col-md-4 mb-3">
                                <div class="card job-card" data-id="${job.id}">
                                    <div class="card-body">
                                        <h5 class="card-title">${job.jobTitle}</h5>
                                            <p class="card-text">${job.description}</p>
                                            <div class="d-flex justify-content-between align-items-center">
                                                <span class="badge ${badgeClass}">
                                                    ${badgeText}
                                                </span>
                                                    <small class="text-muted" style="color: white !important;">${postedText}</small>
                                            </div>
                                            <div class="mt-3">
                                                <button class="btn btn-sm btn-outline-primary view-job">View</button>
                                                <button class="btn btn-sm btn-outline-secondary edit-job">Edit</button>
                                                <button class="btn btn-sm btn-outline-danger delete-job">Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            `;

                $("#homeowner-my-jobs-content .row").append(cardHtml);
            });
        },
        error: function (err) {
            console.error("Failed to load jobs", err);
        }
    });
}

/*-------------------View Job Posts(view Button In cards)----------------*/
function viewJobPostsDetails(jobId) {
    ajaxWithRefresh({
        url: `http://localhost:8080/home/get/${jobId}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (job) {
            console.log(job)
            $("#jobModalTitle").text(job.data.jobTitle);
            $("#jobModalDescription").text(job.data.description);
            $("#jobModalLocation").text(job.data.location);
            $("#jobModalCost").text(job.data.cost);
            $("#jobModalDeadline").text(job.data.deadline);
            $("#jobModalApplications").text(job.data.applicationsCount);

            $("#jobModalUrgency").text(job.data.urgency);
            $("#jobModalDaysSincePosted").text(job.data.daysSincePosted === 0 ? "Today" : `${job.data.daysSincePosted} days ago`);


            var jobModal = new bootstrap.Modal(document.getElementById('jobModal'));
            jobModal.show()
        },
        error: function () {
            alert("Failed to load job details");
        }
    });
}

/*-------------------Loads to update Job Posts----------------*/
function loadsToUpdate(jobId) {
   ajaxWithRefresh({
        url: `http://localhost:8080/home/get/${jobId}`,
        type: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        success: function (job) {
            $("#editJobId").val(job.data.id);
            $("#editJobTitle").val(job.data.jobTitle);
            $("#editJobDeadline").val(job.data.deadline);
            $("#editJobCost").val(job.data.cost);
            $("#editJobLocation").val(job.data.location);
            $("#editJobDescription").val(job.data.description);
            $("#editJobUrgency").val(job.data.urgency);
            $("#editJobModal").modal("show");
        }
    });
}

/*------------Update Job Posts(edit button inside job post cards)------------------*/
function updateJobPosts() {
    const jobData = {
        id: $("#editJobId").val(),
        jobTitle: $("#editJobTitle").val(),
        location: $("#editJobLocation").val(),
        cost: $("#editJobCost").val(),
        deadline: $("#editJobDeadline").val(),
        description: $("#editJobDescription").val(),
        urgency: $("#editJobUrgency").val()
    };

    ajaxWithRefresh({
        url: "http://localhost:8080/home/updateJob",
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify(jobData),
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        success: function () {
            alert("Job updated successfully");
            $("#editJobModal").modal("hide");
            loadMyJobs();
        },
        error: function () {
            alert("Failed to update job");
        }
    });
}
/*---------------------Delete Job Posts---------------------------*/
function deleteJobPosts(jobId) {
    if (confirm("Are you sure you want to delete this job?")) {
        ajaxWithRefresh({
            url: `http://localhost:8080/home/deleteJob/${jobId}`,
            type: "DELETE",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("token")
            },
            success: function () {
                alert("Job deleted successfully");
                loadMyJobs();
            },
            error: function () {
                alert("Failed to delete job");
            }
        });
    }
}

/*------------------------Load Job Applications--------------------------------*/
function loadApplications() {
    const userID = localStorage.getItem("userID");

    ajaxWithRefresh({
        url: `http://localhost:8080/home/getApplications/${userID}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const container = $("#applications-container");
            container.empty();

            if (!res.data || res.data.length === 0) {
                container.append("<p>No applications found.</p>");
                return;
            }

            res.data.forEach(app => {
                const isPending = app.status === "PENDING";

                const isCompleted = app.status === "COMPLETED";

                console.log(app.ratingStatus)
                const alreadyRated = app.ratingStatus === "ADDED";
                console.log(alreadyRated)

                const statusClass = app.status === "ACCEPTED" ? "btn-success" :
                    app.status === "DECLINED" ? "btn-danger" : "btn-warning text-dark";

                const applicationCard = `
        <div class="application-card mb-4 p-4 rounded-3 shadow" data-id="${app.id}" 
             style="background-color: #0b0b3b; color: #f1f1f1; border-left: 4px solid ${
                    app.status === "ACCEPTED" ? "#28a745" : app.status === "DECLINED" ? "#dc3545" : "#ffc107"
                };">

           
            <div class="d-flex justify-content-between align-items-center mb-3">
                <h5 class="mb-0 fw-bold">${app.jobTitle}</h5>
                ${
                    !isPending
                        ? `<button class="btn ${statusClass} btn-sm text-uppercase px-3 py-1" disabled>${app.status}</button>`
                        : `<span class="badge bg-warning text-dark px-3 py-1">PENDING</span>`
                }
            </div>
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3">
                
                <div class="d-flex flex-column flex-md-row align-items-start gap-3 flex-grow-1">
                    <div class="avatar rounded-circle text-center fw-bold" 
                         style="width:50px; height:50px; background-color:#1f1f70; display:flex; align-items:center; justify-content:center; font-size:18px; color:white;">
                        ${app.workerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <strong class="fs-6">${app.workerName}</strong>
                        <div class="small mb-1">${app.skills || "No skills listed"} • ${app.experience} yrs exp</div>
                        <p class="mb-0 fst-italic" style="color:#dcdcdc;">"${app.description}"</p>
                    </div>
                </div>
                ${
                    isPending
                        ? `<div class="d-flex flex-column flex-md-column gap-2 mt-3 mt-md-0">
                               <button class="btn btn-success btn-sm accept-app w-100">Accept</button>
                               <button class="btn btn-outline-danger btn-sm decline-app w-100">Decline</button>
                           </div>`
                        : ""
                }
                ${
                    isCompleted
                        ? `<div class="d-flex flex-column flex-md-column gap-2 mt-3 mt-md-0">
                            <button class="btn btn-sm ${alreadyRated ? 'btn-secondary' : 'btn-gradient'} rate-btn w-100"
                                data-jobid="${app.jobPostsId}" 
                                data-workerid="${app.userId}" 
                                data-workername="${app.workerName}"
                                ${alreadyRated ? 'disabled' : ''}>
                                <i class="bi bi-star-fill me-1"></i> 
                                ${alreadyRated ? 'Rated' : 'Rate ' + app.workerName}
                            </button>
                        </div>`
                        : ""
                }
                </div>
             </div>
            `;
                container.append(applicationCard);
            });
        },
        error: function () {
            alert("Failed to load applications");
        }
    });
}

let selectedStars = 0;
let currentJobId = null;
let currentWorkerId = null;
let currentWorkerName = null;

$(document).on("click", ".rate-btn", function () {
    currentJobId = $(this).data("jobid");
    currentWorkerId = $(this).data("workerid");
    currentWorkerName = $(this).data("workername");

    $("#ratingWorkerName").text("You are rating: " + currentWorkerName);

    console.log("Rating jobPostId:", currentJobId, "userId:", currentWorkerId);

    selectedStars = 0;
    $(".star").removeClass("selected");
    $("#ratingComment").val("");

    $("#ratingModal").modal("show");
});


$("#submitRating").on("click", function () {
    const comment = $("#ratingComment").val();

    if (selectedStars === 0) {
        alert("Please select a star rating.");
        return;
    }

    console.log(currentJobId)

    const ratingData = {
        name: currentWorkerName,
        stars: selectedStars,
        description: comment,
        date: new Date().toISOString(),
        userId: currentWorkerId,
        jobPostId: currentJobId
    };

    ajaxWithRefresh({
        url: "http://localhost:8080/home/ratings",
        type: "POST",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        contentType: "application/json",
        data: JSON.stringify(ratingData),
        success: function () {
            $("#ratingModal").modal("hide");

            const $button = $(`.rate-btn[data-jobid="${currentJobId}"][data-workerid="${currentWorkerId}"]`);
            $button.prop("disabled", true);
            $button.text("Rated");
            $button.removeClass("btn-gradient").addClass("btn-secondary"); // Change styling

            $button.closest(".application-card").addClass("rated-card");
            alert("Thanks for rating!");
            loadApplications();
        },
        error: function () {
            alert("Failed to submit rating.");
        }
    });
});


$(document).on("mouseenter", ".star", function () {
    const value = $(this).data("value");
    $(this).parent().children(".star").each(function () {
        $(this).toggleClass("hover", $(this).data("value") <= value);
    });
});


$(document).on("mouseleave", ".star-rating", function () {
    $(this).children(".star").removeClass("hover");
});


$(document).on("click", ".star", function () {
    selectedStars = $(this).data("value");
    const container = $(this).parent();
    container.children(".star").each(function () {
        $(this).toggleClass("selected", $(this).data("value") <= selectedStars);
    });
});


/*-------------------------------Handle Accept or decline--------------------------*/
$("#applications-container").on("click", ".accept-app", function () {
    const appId = $(this).closest(".application-card").data("id");

    ajaxWithRefresh({
        url: `http://localhost:8080/home/updateApplicationStatus/${appId}`,
        type: "PUT",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        contentType: "application/json",
        data: JSON.stringify({
            status: "ACCEPTED" }
        ),
        success: function () {
            alert("Application Accepted!");
            loadApplications(); // reload list
        },
        error: function () {
            alert("Failed to accept application.");
        }
    });
});

$("#applications-container").on("click", ".decline-app", function () {
    const appId = $(this).closest(".application-card").data("id");

    ajaxWithRefresh({
        url: `http://localhost:8080/home/updateApplicationStatus/${appId}`,
        type: "PUT",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        contentType: "application/json",
        data: JSON.stringify({ status: "DECLINED" }),
        success: function () {
            alert("Application Declined!");
            loadApplications();
        },
        error: function () {
            alert("Failed to decline application.");
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
        if (xhr.status === 401 || xhr.status === 403) { // access token expired
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

                    // Retry original AJAX call with new token
                    options.headers.Authorization = "Bearer " + data.accessToken;
                    $.ajax(options);
                } else {
                    // Refresh failed → logout
                    localStorage.clear();
                    window.location.href = "../Pages/LogIn.html";
                }
            } catch (err) {
                console.error("Refresh token failed", err);
                localStorage.clear();
                window.location.href = "../Pages/LogIn.html";
            }
        } else {
            // other errors
            if (originalError) originalError(xhr, status, error);
        }
    };

    $.ajax(options);
}

