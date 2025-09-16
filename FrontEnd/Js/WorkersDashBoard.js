$(document).ready(function () {
    checkAccountStatus();
    checkToken();
    sideNav();
    loadUserDetails();
    loadLatestJobs();
    loadMyApplications();
    loadActiveJobs();
    loadWorkerStats();
    loadWorkerRecentApplications();
    loadWorkerRecentRatings();
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

function checkAccountStatus() {
    ajaxWithRefresh({
        url: `http://localhost:8080/worker/check-status`,
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


/*----------------Load DashBoard Stats--------------------------*/
function loadWorkerStats() {
    const workerId = localStorage.getItem("userID");
   ajaxWithRefresh({
        url: `http://localhost:8080/worker/stats/${workerId}`,
        type: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        success: function (res) {
            const s = res.data || {};
            $("#wd-applications-sent").text(s.applicationsSentCount ?? 0);
            $("#wd-active-jobs").text(s.activeJobsCount ?? 0);
            $("#wd-completed-jobs").text(s.completedJobsCount ?? 0);
            $("#wd-my-rating").text((s.averageRating ?? 0).toFixed(1));
        },
        error: function (err) { console.error("Worker stats error", err); }
    });
}

/*---------------load Recent Applications--------------------------*/
function loadWorkerRecentApplications() {
    const workerId = localStorage.getItem("userID");
    ajaxWithRefresh({
        url: `http://localhost:8080/worker/recent-applications/${workerId}`,
        type: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        success: function (res) {
            const list = Array.isArray(res.data) ? res.data : [];
            const box = $("#worker-recent-applications");
            box.empty();
            if (list.length === 0) {
                box.append(`
          <div class="text-center py-4">
            <i class="fas fa-user-clock fa-2x mb-2"></i>
            <p>No recent applications whotto</p>
          </div>
        `);
                return;
            }
            list.forEach(a => {
                const statusBadgeClass =
                    a.status === "ACCEPTED" ? "bg-success" :
                        a.status === "DECLINED" ? "bg-danger" : "bg-warning";
                box.append(`
          <div class="job-card card mb-2 shadow-sm border-0 rounded-3">
            <div class="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-0">${a.jobTitle || "Job"}</h6>
                <small>Applied ${timeAgo(a.appliedDate)}</small>
              </div>
              <span class="badge ${statusBadgeClass}">${a.status || "PENDING"}</span>
            </div>
          </div>
        `);
            });
        },
        error: function (err) { console.error("Recent applications error", err); }
    });
}

function timeAgo(dateString) {
    if (!dateString) return "Today";
    const now = new Date();
    const dt = new Date(dateString);
    const diff = Math.floor((now - dt) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return "Today";
    if (diff === 1) return "1 day ago";
    return `${diff} days ago`;
}

/*-------------------------------Load recent ratings in Dashboard-------------------------*/
function loadWorkerRecentRatings() {
    const workerId = localStorage.getItem("userID");
    ajaxWithRefresh({
        url: `http://localhost:8080/worker/recent-ratings/${workerId}`,
        type: "GET",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
        success: function (res) {
            const list = Array.isArray(res.data) ? res.data : [];
            const box = $("#worker-recent-ratings");
            console.log(list)
            box.empty();
            if (list.length === 0) {
                box.append(`
          <div class="text-center py-4">
            <i class="fas fa-star-half-alt fa-2x mb-2"></i>
            <p>No ratings yet</p>
          </div>
        `);
                return;
            }
            list.forEach(r => {
                const stars = "★".repeat(r.stars || 0) + "☆".repeat(Math.max(0, 5 - (r.stars || 0)));
                box.append(`
          <div class="card mb-2 shadow-sm border-0 rounded-3">
            <div class="card-body">
              <div class="d-flex justify-content-between">
                <small>${r.name}</small>
                 <div class="mt-1">${stars}</div>
               
              </div>
              ${r.description ? `<small class="d-block mt-1">"${r.description}"</small>` : ""}
               <small class="mt-1">${timeAgo(r.date)}</small>
            </div>
          </div>
        `);
            });
        },
        error: function (err) { console.error("Recent ratings error", err); }
    });
}


/*---------------------SIGN OUT Button---------------------------*/
$("#logoutBTN").on('click', function () {
   localStorage.clear()
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

   ajaxWithRefresh({
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

   ajaxWithRefresh({
        url: `http://localhost:8080/worker/latest/${userID}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const jobsContainer = $("#jobs-container");
            jobsContainer.empty();

            const activeJobs = res.data.filter(job => job.jobPostStatus !== "DELETED");

            if (activeJobs.length  === 0) {
                jobsContainer.append(`  
   <div class="d-flex justify-content-center align-items-center py-5 px-3">
            <div class="card text-center shadow-lg p-4" 
                 style="max-width: 600px; width: 100%; border-radius: 20px; background: linear-gradient(135deg, #350091, #1f22f0); color: #fff;">
                <div class="card-body">
                    <div class="mb-4">
                        <i class="fas fa-clipboard-list fa-5x"></i>
                    </div>
                    <h3 class="card-title mb-3">No Jobs Posts Yet</h3>
                    <p class="card-text mb-4" style="font-size: 1.1rem;">
                        Currently, there are no job posts available. Please check back later.
                    </p>
                </div>
            </div>
        </div>
                   
                `)
                return;
            }

            activeJobs.forEach(job => {
                // build button depending on applied flag
                let buttonHtml;
                if (job.jobPostVisibility === "DISABLE") return;
                if (job.applied) {
                    buttonHtml = `<button class="btn btn-secondary btn-sm w-100 apply-job" disabled>APPLIED</button>`;
                } else {
                    buttonHtml = `<button class="btn btn-custom btn-sm w-100 apply-job">Apply Now</button>`;
                }


                if (job.jobPostStatus === 'COMPLETED' || job.jobPostStatus === 'ACCEPTED') {
                    buttonHtml = `<button class="btn btn-secondary btn-sm w-100 apply-job" disabled>This Job is Closed</button>`;
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
                                    <small>
                                        <i class="fas fa-map-marker-alt"></i> ${job.location}
                                    </small>
                                    <small>
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

function searchJobs() {
    let searchValue = $("#jobSearch").val();
    let locationValue = $("#locationFilter").val();
    const userID = localStorage.getItem("userID");

    ajaxWithRefresh({
        url: `http://localhost:8080/worker/search?keyword=${searchValue}&location=${locationValue}&userID=${userID}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (response) {
            let jobsContainer = $("#jobs-container");
            jobsContainer.empty();

            const activeJobs = response.data.filter(job => job.jobPostStatus !== "DELETED");

            if (activeJobs.length === 0) {
                jobsContainer.append(`
                    <div class="d-flex justify-content-center align-items-center py-5 px-3">
                        <div class="card text-center shadow-lg p-4"
                             style="max-width: 600px; width: 100%; border-radius: 20px;
                             background: linear-gradient(135deg, #1305d6, #3d008e); color: #fff;">
                            <div class="card-body">
                                <div class="mb-4">
                                    <i class="fas fa-clipboard-list fa-5x"></i>
                                </div>
                                <h3 class="card-title mb-3">No Jobs Posts Found</h3>
                                <p class="card-text mb-4" style="font-size: 1.1rem;">
                                    Currently, there are no job posts available. Please check back later.
                                </p>
                            </div>
                        </div>
                    </div>
                `);
                return;
            }

            activeJobs.forEach(job => {
                let buttonHtml;
                if (job.jobPostVisibility === "DISABLE") return;
                if (job.applied) {
                    buttonHtml = `<button class="btn btn-secondary btn-sm w-100 apply-job" disabled>APPLIED</button>`;
                } else {
                    buttonHtml = `<button class="btn btn-custom btn-sm w-100 apply-job">Apply Now</button>`;
                }

                if (job.jobPostStatus === 'COMPLETED') {
                    buttonHtml = `<button class="btn btn-secondary btn-sm w-100 apply-job" disabled>This Job is Closed</button>`;
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
                                    <small><i class="fas fa-map-marker-alt"></i> ${job.location}</small>
                                    <small><i class="fas fa-clock"></i> ${job.daysSincePosted > 0 ? 'Posted ' + job.daysSincePosted + ' days ago' : 'Posted Today'}</small>
                                </div>
                                ${buttonHtml}
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
}

// Trigger on typing OR changing dropdown
$("#jobSearch").on("keyup", searchJobs);
$("#locationFilter").on("change", searchJobs);


/*----------------- Search Jobs with Filters -----------------*/
/*$("#jobSearch").on("keyup", function () {
    let searchValue = $(this).val();
    const userID = localStorage.getItem("userID"); // optional if needed

    ajaxWithRefresh({
        url: `http://localhost:8080/worker/search?keyword=${searchValue}&userID=${userID}`, // make sure backend accepts userId
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token") // <-- must be correct
        },
        data: {search: searchValue},
        success: function (response) {
           let jobsContainer = $("#jobs-container")

          jobsContainer.empty();

            const activeJobs = response.data.filter(job => job.jobPostStatus !== "DELETED");
            if (activeJobs.length  === 0) {
                jobsContainer.append(`  
   <div class="d-flex justify-content-center align-items-center py-5 px-3">
            <div class="card text-center shadow-lg p-4" 
                 style="max-width: 600px; width: 100%; border-radius: 20px; background: linear-gradient(135deg, #1305d6, #3d008e); color: #fff;">
                <div class="card-body">
                    <div class="mb-4">
                        <i class="fas fa-clipboard-list fa-5x"></i>
                    </div>
                    <h3 class="card-title mb-3">No Jobs Posts Found</h3>
                    <p class="card-text mb-4" style="font-size: 1.1rem;">
                        Currently, there are no job posts available. Please check back later.
                    </p>
                </div>
            </div>
        </div>
                   
                `)
                return;
            }


            activeJobs.forEach(job => {
                let buttonHtml;
                if (job.jobPostVisibility === "DISABLE") return;
                if (job.applied) {
                    buttonHtml = `<button class="btn btn-secondary btn-sm w-100 apply-job" disabled>APPLIED</button>`;
                } else {
                    buttonHtml = `<button class="btn btn-custom btn-sm w-100 apply-job">Apply Now</button>`;
                }

                if (job.jobPostStatus === 'COMPLETED') {
                    buttonHtml = `<button class="btn btn-secondary btn-sm w-100 apply-job" disabled>This Job is Closed</button>`;
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
                                    <small><i class="fas fa-map-marker-alt"></i> ${job.location}</small>
                                    <small><i class="fas fa-clock"></i> ${job.daysSincePosted > 0 ? 'Posted ' + job.daysSincePosted + ' days ago' : 'Posted Today'}</small>
                                </div>
                                ${buttonHtml} <!-- use buttonHtml here -->
                            </div>
                        </div>
                    </div>`;

                $("#jobs-container").append(card);
            });
            loadLatestJobs()
        },
        error: function (err) {
            console.error("Failed to load filtered jobs", err);
        }
    });
});*/

/*--------------------------------------Load My Applications-----------------------------------------------------*/
function loadMyApplications() {
    const userId = localStorage.getItem("userID");
    ajaxWithRefresh({
        url: `http://localhost:8080/worker/getApplication/${userId}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const tbody = $("#myApplicationTbody");
            tbody.empty();

            if (!res.data || res.data.length === 0) {
                tbody.append(`  <tr class="no-data-row">
            <td colspan="5">
                <div class="d-flex flex-column align-items-center justify-content-center">
                    <i class="fas fa-clipboard-list"></i>
                    <span>No applications found</span>
                </div>
            </td>
        </tr>`)
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

   ajaxWithRefresh({
        url: "http://localhost:8080/worker/saveApplication",
        type: "POST",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        contentType: "application/json",
        data: JSON.stringify(applicationDTO),
        success: function () {
            Swal.fire({
                title: 'Applied!',
                text: 'Your have successfully Applied For the Job.',
                icon: 'success',
                background: '#0a0f3d',
                color: '#ffffff',
                confirmButtonColor: '#667eea',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: true
            }).then(() => {
                $("#applyJobModal").modal("hide");
                const $button = $card.find(".apply-job");
                $button.text("APPLIED").prop("disabled", true).removeClass("btn-custom").addClass("btn-secondary");
                loadMyApplications();
                loadWorkerRecentApplications();
                loadWorkerRecentRatings();
                loadDashboardStats();
            });
        },
        error: function () {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to Apply for the Job",
                showConfirmButton: false,
                timer: 1500
            });
        }
    });
});

/*-----------------------------Load Active Jobs to Search-----------------------------*/
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
                        onclick="markComplete(${job.applicationId}, ${job.jobPostId})">
                            Mark Complete
            </button>
              </div>
            </div>
          </div>
        `;
    });
}

/*----------------------Mark Active Job as Complete----------------------------*/
function markComplete(applicationID) {
    const userID = localStorage.getItem("userID")
    const token = localStorage.getItem("token")
    const $btn = $(this);
    $btn.prop("disabled", true).text("Processing...");

   ajaxWithRefresh({
        url: `http://localhost:8080/worker/mark-complete?applicationId=${applicationID}&userId=${userID}`,
        method: "PUT",
        headers: {
            "Authorization": "Bearer " + token
        },
        contentType: "application/json",
        success: function() {
            $btn.prop("disabled", false).text("Marked");
            Swal.fire({
                title: 'Marked!',
                text: 'Marked Job post successfully.',
                icon: 'success',
                background: '#0a0f3d',
                color: '#ffffff',
                confirmButtonColor: '#667eea',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: true
            }).then(() => {
                loadActiveJobs();
                loadMyApplications();
                loadWorkerStats()
                loadRecentJobs()
                loadDashboardStats()
                loadWorkerRecentApplications()
            });
        },
        error: function(xhr) {

            Swal.fire({
                background: "#1e1e1e",   // dark background
                color: "#ffffff",
                position: "center",
                icon: "error",
                title: "Failed to mark as complete",
                showConfirmButton: false,
                timer: 1500
            });
            console.error(xhr.responseText);
        }
    });
}

/*----------------------Update Worker Profile details----------------------------*/
$("#updateUserForm").on('submit', function(e) {
    e.preventDefault();

    const updatedWorker = {
        username: $("#profileUserName").val(),
        email: $("#profileEmail").val(),
        phone: $("#profilePhone").val(),
    };

    ajaxWithRefresh({
        url: "http://localhost:8080/worker/updateUserWorkerController",
        type: "PUT",
        data: JSON.stringify(updatedWorker),
        contentType: "application/json",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function() {
            Swal.fire({
                title: 'Updated!',
                text: 'Your Account Details updated successfully.',
                icon: 'success',
                background: '#0a0f3d',
                color: '#ffffff',
                confirmButtonColor: '#667eea',
                timer: 2000,
                timerProgressBar: true,
                showConfirmButton: true
            })

        },
        error: function(xhr) {
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Failed to update profile details. Please try again.",
                showConfirmButton: false,
                timer: 1500
            });
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
        background: '#0a0f3d', // Dark background
        color: '#ffffff',       // Text color
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






