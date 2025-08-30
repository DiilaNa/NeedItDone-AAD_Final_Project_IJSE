$(document).ready(function () {
    loadMyJobs();
    loadUserDetails();
    sideNav();
    loadApplications();

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
/*---------------------Switch Modes------------------------*/

let currentMode = localStorage.getItem("mode") || "HIRE";
if (currentMode === "HIRE") {
    $("#switch").text("Switch to Work Mode");
} else {
    $("#switch").text("Switch to Hire Mode");
}

$("#switch").on('click', function () {
    switchModes();
});
function switchModes() {
    if (currentMode === "HIRE") {
        currentMode = "WORK";
        localStorage.setItem("mode", "WORK");
        window.location.href = "WorkersDashBoard.html";
    } else {
        currentMode = "HIRE";
        localStorage.setItem("mode", "HIRE");
        window.location.href = "HomeOwnerDashBoard.html";
    }
}

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

    console.log(JobData)

    $.ajax({
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
    $.ajax({
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

    $.ajax({
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
    $.ajax({
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

                let postedText = job.daysSincePosted > 0
                    ? `Posted ${job.daysSincePosted} days ago`
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
    $.ajax({
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
    $.ajax({
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

    $.ajax({
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
        $.ajax({
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

    $.ajax({
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
/*-------------------------------Handle Accept or decline--------------------------*/
$("#applications-container").on("click", ".accept-app", function () {
    const appId = $(this).closest(".application-card").data("id");

    $.ajax({
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

    $.ajax({
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
