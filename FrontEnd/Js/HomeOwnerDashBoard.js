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

    checkAccountStatus();

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

function checkAccountStatus() {
    ajaxWithRefresh({
        url: `http://localhost:8080/home/check-status`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function(res) {
            console.log(res.message);
        },
        error: function(xhr) {
            if(xhr.status === 403) {
                alert(xhr.responseJSON.message); // "Account banned"
                window.location.href = "../Pages/HomePage.html"; // redirect to homepage
            }
        }
    });
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
                        <i class="fas fa-briefcase fa-2x mb-2"></i>
                        <p>No recent jobs available</p>
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

                let jobHtml = "";

                if (job.jobPostVisibility === "DISABLE") {
                    jobHtml = `
                        <div class="job-card card mb-2 shadow-sm">
                            <div class="card job-card disabled-job" data-id="${job.id}">
                                <div class="card-body">
                                    <h5 class="card-title">${job.jobTitle}</h5>
                                    <p class="card-text text-danger">This job has been removed by admin.</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="badge bg-secondary">Disabled</span>
                                        <small>Posted ${job.postedDate ? moment(job.postedDate).fromNow() : 'Today'}</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else{
                    jobHtml = `
                    <div class="job-card card mb-2 shadow-sm">
                         <div class="card-body">
                             <h6>${job.jobTitle}</h6>
                             <p class="small" style="color: white !important;">${postedText}</p>
                             <span class="badge ${badgeClass} status-badge">${badgeText}</span
                              <div class="d-flex justify-content-between align-items-center">
                                  <small>Posted ${job.postedDate ? moment(job.postedDate).fromNow() : 'Today'}</small>
                              </div>
                         </div>
                    </div>
               `;

                }
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
                        <i class="fas fa-user-clock fa-2x mb-2"></i>
                        <p>No recent applications yet</p>
                    </div>
                `);
                return;
            }
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
                title: 'Saved!',
                text: 'Your Post have been saved successfully.',
                icon: 'success',
                background: '#0a0f3d', // Dark background
                color: '#ffffff',       // Text color
                confirmButtonColor: '#667eea',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: true
            }).then(() => {
                loadRecentJobs();
                loadRecentApplications();
                loadDashboardStats();
                loadMyJobs();
                loadWorkerStats();
            });
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
        success: function(response) {
            if (response.data === 200){
                Swal.fire({
                    title: 'Saved!',
                    text: 'Your Post has been saved successfully.',
                    icon: 'success',
                    background: '#0a0f3d',
                    color: '#ffffff',
                    confirmButtonColor: '#667eea',
                    timer: 2000,
                    timerProgressBar: true,
                    showConfirmButton: true
                }).then(() => {
                    loadMyJobs();
                    loadUserDetails();
                });
            } else {
                // Show inline toast-style message
                const msg = document.getElementById('updateMessage');
                msg.innerText = "Failed to save post!";
                msg.style.display = 'block';
                setTimeout(() => {
                    msg.style.display = 'none';
                }, 3000); // hide after 3 seconds
            }
        },

    });
});

/*-----------------Load Job Posts-------------------------------------*/
function loadMyJobs() {
    const userID = localStorage.getItem("userID");
    ajaxWithRefresh({
        url: `http://localhost:8080/home/get${userID}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const jobsContainer = $("#homeowner-my-jobs-content .row");
            jobsContainer.empty();

            // Filter out deleted jobs
            const activeJobs = res.data.filter(job => job.jobPostStatus !== "DELETED");

            if (activeJobs.length === 0) {
                // No active jobs to show
                jobsContainer.append(`<div class="d-flex justify-content-center align-items-center py-5 px-3">
                    <div class="card text-center shadow-lg p-4" 
                    style="max-width: 600px; width: 100%; border-radius: 20px; background: linear-gradient(135deg, #5205d6, #7c1ff0); color: #fff;">
                        <div class="card-body">
                            <div class="mb-4">
                                <i class="fas fa-briefcase fa-5x"></i>
                            </div>
                            <h3 class="card-title mb-3">No Job Posts Found</h3>
                            <p class="card-text mb-4" style="font-size: 1.1rem;">
                                Currently, there are no job posts available. Please check back later or create a new job post if you are an employer.
                            </p>
                            <a href="#homeowner-post-job-content" class="btn btn-light btn-lg">Post a Job</a>
                        </div>
                    </div>
                </div>`);
                return;
            }

            // Render jobs
            activeJobs.forEach(job => {
                let cardHtml = '';

                if (job.jobPostVisibility === "DISABLE") {
                    // Job disabled by admin
                    cardHtml = `
                        <div class="col-md-4 mb-3">
                            <div class="card job-card disabled-job" data-id="${job.id}">
                                <div class="card-body">
                                    <h5 class="card-title">${job.jobTitle}</h5>
                                    <p class="card-text text-danger">This job has been removed by admin.</p>
                                    <div class="d-flex justify-content-between align-items-center">
                                        <span class="badge bg-secondary">Disabled</span>
                                        <small class="text-muted">Posted ${job.postedDate ? moment(job.postedDate).fromNow() : 'Today'}</small>
                                    </div>
                                    <div class="mt-5"> </div>
                                </div>
                            </div>
                        </div>
                    `;
                } else {
                    // Active job
                    let badgeText = job.applicationsCount > 0
                        ? `${job.applicationsCount} Applications`
                        : 'In Progress';

                    let badgeClass = job.applicationsCount > 0
                        ? (job.urgency === 'In Progress' ? 'bg-warning' : 'bg-success')
                        : 'bg-warning text-white';

                    let postedText = job.postedDate
                        ? `Posted ${moment(job.postedDate).fromNow()}`
                        : 'Posted Today';

                    cardHtml = `
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
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }

                jobsContainer.append(cardHtml);
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
            Swal.fire({
                title: 'Updated!',
                text: 'Your Post has been Updated successfully.',
                icon: 'success',
                background: '#0a0f3d',
                color: '#ffffff',
                confirmButtonColor: '#667eea',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: true
            }).then(() => {
                loadMyJobs();
                loadUserDetails();
            });
            $("#editJobModal").modal("hide");
        },
        error: function () {
            const msg = document.getElementById('updateMessage');
            msg.innerText = "Failed to save post!";
            msg.style.display = 'block';
            setTimeout(() => {
                msg.style.display = 'none';
            }, 3000);
        }
    });
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

            if (res.data.jobPostVisibility === "DISABLE"){
                    return;
            }

            if (!res.data || res.data.length === 0) {
                container.append(`<div class="d-flex justify-content-center align-items-center py-5 px-3">
                        <div class="card text-center shadow-lg p-4"
                             style="max-width: 600px; width: 100%; border-radius: 20px; background: linear-gradient(135deg, #5205d6, #7c1ff0); color: #fff;">
                            <div class="card-body">
                                <div class="mb-4">
                                  <i class="fas fa-hourglass-half fa-5x"></i>
                                </div>
                                <h3 class="card-title mb-3">No Job Applications Found</h3>
                                <p class="card-text mb-4" style="font-size: 1.1rem;">
                                    Currently, there are no job Applications Received. Please check back later.
                                </p>
                            </div>
                        </div>
                    </div>`
                );
                return;
            }


            res.data.forEach(app => {
                const isPending = app.status === "PENDING";

                const isCompleted = app.status === "COMPLETED";

                const alreadyRated = app.ratingStatus === "ADDED";

                const statusClass = app.status === "ACCEPTED" ? "btn-success" :
                    app.status === "REJECTED" ? "btn-danger" : "btn-warning text-dark";

                const applicationCard = `
        <div class="application-card mb-4 p-4 rounded-3 shadow" data-id="${app.id}" 
             style="background-color: #0b0b3b; color: #f1f1f1; border-left: 4px solid ${
                    app.status === "ACCEPTED" ? "#28a745" : app.status === "REJECTED" ? "#dc3545" : "#ffc107"
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
            Swal.fire({
                title: 'Done!',
                text: 'Rated for user successfully.',
                icon: 'success',
                background: '#0a0f3d',
                color: '#ffffff',
                confirmButtonColor: '#667eea',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: true
            }).then(() => {
                $("#ratingModal").modal("hide");
                const $button = $(`.rate-btn[data-jobid="${currentJobId}"][data-workerid="${currentWorkerId}"]`);
                $button.prop("disabled", true);
                $button.text("Rated");
                $button.removeClass("btn-gradient").addClass("btn-secondary"); // Change styling
                $button.closest(".application-card").addClass("rated-card");
                loadApplications();

            });
        },
        error: function () {
            Swal.fire({
                background: "#1e1e1e",
                color: "#ffffff",
                position: "center",
                icon: "error",
                title: "Failed to Save",
                showConfirmButton: false,
                timer: 1500
            });
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

/*-------------------------------Handle Accept --------------------------*/
$("#applications-container").on("click", ".accept-app", function () {
    const appId = $(this).closest(".application-card").data("id");
    const btn = $(this);
    btn.prop("disabled", true).text("Processing...");

    ajaxWithRefresh({
        url: `http://localhost:8080/home/updateApplicationStatus/${appId}`,
        type: "PUT",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        contentType: "application/json",
        data: JSON.stringify({ status: "ACCEPTED" }),
        success: function () {
            btn.prop("disabled", false).text("Accepted");
            Swal.fire({
                title: 'Success',
                text: 'Application Accepted',
                icon: 'success',
                background: '#0a0f3d',
                color: '#ffffff',
                confirmButtonColor: '#667eea',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: true
            }).then(() => {
                loadApplications();
            });
        },
        error: function () {
            Swal.fire({
                background: "#1e1e1e",
                color: "#ffffff",
                position: "center",
                icon: "error",
                title: "Failed !!",
                showConfirmButton: false,
                timer: 1500
            });
            btn.prop("disabled", false).text("Accept"); // reset on failure
        }
    });
});

/*-------------------------------Handle Decline --------------------------*/
$("#applications-container").on("click", ".decline-app", function () {
    const appId = $(this).closest(".application-card").data("id");
    const btn = $(this);
    btn.prop("disabled", true).text("Processing...");

    ajaxWithRefresh({
        url: `http://localhost:8080/home/updateApplicationStatus/${appId}`,
        type: "PUT",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        contentType: "application/json",
        data: JSON.stringify({ status: "REJECTED" }),
        success: function () {
            btn.prop("disabled", false).text("Declined");
            Swal.fire({
                title: 'Success!',
                text: 'Application Declined',
                icon: 'success',
                background: '#0a0f3d',
                color: '#ffffff',
                confirmButtonColor: '#667eea',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: true
            }).then(() => {
                loadApplications();
            });
        },
        error: function () {
            Swal.fire({
                background: "#1e1e1e",
                color: "#ffffff",
                position: "center",
                icon: "error",
                title: "Failed !!",
                showConfirmButton: false,
                timer: 1500
            });
            btn.prop("disabled", false).text("Decline"); // reset on failure
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

/*    Swal.fire({
        title: 'Saved!',
        text: 'Your Post have been saved successfully.',
        icon: 'success',
        background: '#0a0f3d',
        color: '#ffffff',
        confirmButtonColor: '#667eea',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: true
    }).then(() => {
    });

    Swal.fire({
        background: "#1e1e1e",   // dark background
        color: "#ffffff",
        position: "center",
        icon: "error",
        title: "Failed to Save",
        showConfirmButton: false,
        timer: 1500
    });*/




