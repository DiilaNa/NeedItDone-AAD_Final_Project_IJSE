$(document).ready(function () {
    checkToken();
    sideNav();
    loadUserDetails();
    loadLatestJobs();
    loadMyApplications();
    loadActiveJobs();
});

function checkToken() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (!token) {
        window.location.href = "../Pages/LogIn.html";
    }
    if (role !== "WORKER") {
        window.location.href = "../Pages/LogIn.html";
        return;
    }
}

/*---------------------SIGN OUT Button---------------------------*/
$("#logoutBTN").on('click', function () {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role")
    localStorage.removeItem("token");
    localStorage.removeItem("userID");
    window.location.href = "../Pages/HomePage.html";
})

/*----------------------------Side Navigation Bar-----------------------*/
function sideNav() {
    var $circleMenuBtn = $('#circleMenuBtn');
    var $hamburgerIcon = $('#hamburgerIcon');
    var $sideNav = $('#sideNav');
    var $navBackdrop = $('#navBackdrop');


    $circleMenuBtn.on('click', function () {
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

    $navBackdrop.on('click', function () {
        $sideNav.removeClass('show');
        $navBackdrop.removeClass('show');
        $hamburgerIcon.removeClass('active');
        $circleMenuBtn.removeClass('active');
    });

    $('.nav-menu a').on('click', function () {
        if ($(window).width() <= 991) {
            $sideNav.removeClass('show');
            $navBackdrop.removeClass('show');
            $hamburgerIcon.removeClass('active');
            $circleMenuBtn.removeClass('active');
        }
    });
}

function loadUserDetails() {

    $.ajax({
        url: "http://localhost:8080/worker/loadUserDetails",
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },

        success: function (user) {
            $("#profileUserName").val(user.data.username);
            $("#profileEmail").val(user.data.email);
            $("#profilePhone").val(user.data.phone);
        }
    });
}

/*----------------- Load Latest Jobs for Workers -----------------*/
function loadLatestJobs() {
    $("#jobs-container").empty();
    const userID = localStorage.getItem("userID");

    $.ajax({
        url: `http://localhost:8080/worker/latest/${userID}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const jobsContainer = $("#jobs-container");
            jobsContainer.empty();

            res.data.forEach(job => {
                // build button depending on applied flag
                let buttonHtml;
                if (job.applied) {
                    buttonHtml = `<button class="btn btn-secondary btn-sm w-100 apply-job" disabled>APPLIED</button>`;
                } else {
                    buttonHtml = `<button class="btn btn-custom btn-sm w-100 apply-job">Apply Now</button>`;
                }

                const cardHtml = `
                    <div class="col-md-6 mb-3">
                        <div class="card job-card shadow-sm" data-id="${job.id}">
                            <div class="card-body">
                                <h5 class="card-title">${job.jobTitle}</h5>
                                <p class="card-text">${job.description}</p>
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-primary">${job.categoryName}</span>
                                    <span class="text-success fw-bold">$${job.cost}</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <small class="text-muted">
                                        <i class="fas fa-map-marker-alt"></i> ${job.location}
                                    </small>
                                    <small class="text-muted">
                                        <i class="fas fa-clock"></i> 
                                        ${job.daysSincePosted > 0 ? 'Posted ' + job.daysSincePosted + ' days ago' : 'Posted Today'}
                                    </small>
                                </div>
                                ${buttonHtml}
                            </div>
                        </div>
                    </div>
                `;
                jobsContainer.append(cardHtml);
            });
        },
        error: function (err) {
            console.error("Failed to load latest jobs", err);
        }
    });
}

/*----------------- Load Jobs with Filters -----------------*/
$("#jobSearch").on("keyup", function () {
    let searchValue = $(this).val();
    const userID = localStorage.getItem("userID"); // optional if needed

    $.ajax({
        url: `http://localhost:8080/worker/search?keyword=${searchValue}&userID=${userID}`, // make sure backend accepts userId
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token") // <-- must be correct
        },
        data: {search: searchValue},
        success: function (response) {
            $("#jobs-container").empty();

            let jobs = response.data;

            jobs.forEach(job => {
                // build button based on applied flag
                let buttonHtml;
                if (job.applied) {
                    buttonHtml = `<button class="btn btn-secondary btn-sm w-100 apply-job" disabled>APPLIED</button>`;
                } else {
                    buttonHtml = `<button class="btn btn-custom btn-sm w-100 apply-job">Apply Now</button>`;
                }

                let card = `
                    <div class="col-md-6 mb-3">
                        <div class="card job-card" data-id="${job.id}">
                            <div class="card-body">
                                <h5 class="card-title">${job.jobTitle}</h5>
                                <p class="card-text">${job.description}</p>
                                <div class="d-flex justify-content-between align-items-center mb-2">
                                    <span class="badge bg-primary">${job.categoryName}</span>
                                    <span class="text-success fw-bold">$${job.cost}</span>
                                </div>
                                <div class="d-flex justify-content-between align-items-center mb-3">
                                    <small class="text-muted"><i class="fas fa-map-marker-alt"></i> ${job.location}</small>
                                    <small class="text-muted"><i class="fas fa-clock"></i> ${job.daysSincePosted > 0 ? 'Posted ' + job.daysSincePosted + ' days ago' : 'Posted Today'}</small>
                                </div>
                                ${buttonHtml} <!-- use buttonHtml here -->
                            </div>
                        </div>
                    </div>`;

                $("#jobs-container").append(card);
            });
        },
        error: function (err) {
            console.error("Failed to load filtered jobs", err);
        }
    });
});


/*-------------------------------------------------------------------------------------------*/
function loadMyApplications() {
    const userId = localStorage.getItem("userID");
    console.log(userId)
    $.ajax({
        url: `http://localhost:8080/worker/getApplication/${userId}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const tbody = $("#myApplicationTbody");
            tbody.empty();

            if (!res.data || res.data.length === 0) {
                tbody.append('<tr><td colspan="5">No applications found</td></tr>');
                return;
            }


            res.data.forEach(app => {
                const row = `
                    <tr>
                        <td>${app.jobTitle}</td>
                        <td><span class="badge bg-primary">${app.category}</span></td>
                        <td>$${app.amount}</td>
                        <td>${new Date(app.date).toLocaleDateString()}</td>
                        <td><span class="badge ${getStatusBadgeClass(app.status)}">${app.status}</span></td>
                    </tr>
                `;
                tbody.append(row);
            });
        },
        error: function (err) {
            console.error("Failed to load applications", err);
        }
    });
}

// Helper to assign badge color based on status
function getStatusBadgeClass(status) {
    switch (status.toLowerCase()) {
        case 'pending':
            return 'bg-warning';
        case 'approved':
            return 'bg-success';
        case 'rejected':
            return 'bg-danger';
        default:
            return 'bg-secondary';
    }
}

/*-----------------------------Applying For the Job-----------------------------*/
$("#worker-browse-jobs-content").on("click", ".apply-job", function () {
    const $card = $(this).closest(".job-card");

    $("#modalJobId").val($card.data("id"));
    $("#applyJobModal").modal("show");
});

$("#applyJobForm").submit(function (e) {
    e.preventDefault();

    const jobId = $("#modalJobId").val();
    const userId = localStorage.getItem("userID");

    const $card = $(`[data-id=${jobId}]`);
    const jobTitle = $card.find(".card-title").text();
    const category = $card.find(".badge").text();
    const amountText = $card.find(".text-success").text();
    const amount = parseFloat(amountText.replace('$', ''));

    const applicationDTO = {
        jobPostsId: jobId,
        userId: userId,
        jobTitle: jobTitle,
        category: category,
        date: new Date(),
        status: "PENDING",
        amount: amount,
        description: $("#modalDescription").val(),
        skills: $("#modalSkills").val(),
        experience: $("#modalExperience").val()
    };

    $.ajax({
        url: "http://localhost:8080/worker/saveApplication",
        type: "POST",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        contentType: "application/json",
        data: JSON.stringify(applicationDTO),
        success: function () {
            alert("Application submitted successfully!");
            $("#applyJobModal").modal("hide");
            const $button = $card.find(".apply-job");
            $button.text("APPLIED").prop("disabled", true).removeClass("btn-custom").addClass("btn-secondary");
            loadMyApplications();
        },
        error: function () {
            alert("Failed to apply. Try again.");
        }
    });
});

async function loadActiveJobs() {
    const workerId = localStorage.getItem("userID"); // assuming you stored user id
    const token = localStorage.getItem("token");

    const response = await fetch(`http://localhost:8080/worker/${workerId}/active-jobs`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    if (response.ok) {
        const jobs = await response.json();
        renderJobs(jobs);
    } else {
        console.error("Failed to load active jobs");
    }
}

function renderJobs(jobs) {
    const container = document.querySelector("#worker-active-jobs-content .row");
    if (!container) {
        console.error("Container not found!");
        return;
    }

    container.innerHTML = ""; // clear old cards

    if (jobs.length === 0) {
        // Show a "No active jobs" card
        container.innerHTML = `
            <div class="col-12">
                <div class="card text-center">
                    <div class="card-body">
                        <h5 class="card-title">No Active Jobs</h5>
                        <p class="card-text">You currently have no active jobs assigned. Check back later!</p>
                    </div>
                </div>
            </div>
        `;
        return;
    }



    jobs.forEach(job => {
        container.innerHTML += `
          <div class="col-md-6 mb-3">
            <div class="card job-card">
              <div class="card-body">
                <h5 class="card-title">${job.jobTitle}</h5>
                <p class="card-text">${job.description}</p>
                <div class="row">
                  <div class="col-6">
                    <small>Deadline</small>
                    <p>${job.deadline}</p>
                  </div>
                  <div class="col-6">
                    <small>Payment</small>
                    <p class="text-success fw-bold">$${job.cost}</p>
                  </div>
                </div>
                 <button class="btn btn-success btn-sm" 
                    onclick="markComplete(${job.id})">
              Mark Complete
            </button>
              </div>
            </div>
          </div>
        `;
    });
}

function markComplete(applicationId) {
    const userID = localStorage.getItem("userID")
    $.ajax({
        url: `http://localhost:8080/worker/mark-complete?applicationId=${applicationId}&userId=${userID}`,
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("token")
        },
        success: function(response) {
            alert("Job marked complete!");
            loadActiveJobs();
            loadMyApplications();
        },
        error: function(xhr) {
            console.error(xhr.responseText);
        }
    });
}




