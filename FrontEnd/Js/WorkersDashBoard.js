$(document).ready(function() {
    sideNav();
    loadUserDetails();
    loadLatestJobs();
    loadMyApplications();
});
/*---------------------SIGN OUT Button---------------------------*/
$("#logoutBTN").on('click',function () {
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


/*-----------------------------Switch Modes------------------------------------*/

let currentMode = localStorage.getItem("mode") || "WORK";

if (currentMode === "WORK") {
    $("#switch").text("Switch to Hire Mode");
} else {
    $("#switch").text("Switch to Work Mode");
}

$("#switch").on('click', function () {
    switchModes();
});


function switchModes() {
    if (currentMode === "WORK") {

        currentMode = "HIRE";
        localStorage.setItem("mode", "HIRE");
        window.location.href = "HomeOwnerDashBoard.html";
    } else {

        currentMode = "WORK";
        localStorage.setItem("mode", "WORK");
        window.location.href = "WorkersDashBoard.html";
    }
}


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

/*---------------------Apply Job-----------------------------------------*/
$("#worker-browse-jobs-content").on("click", ".apply-job", function () {
    const $card = $(this).closest(".job-card");
    const $button = $(this)
    const jobId = $(this).closest(".job-card").data("id");
    const userId = localStorage.getItem("userID");
    const jobTitle = $card.find(".card-title").text();
    const category = $card.find(".badge").text();
    const amountText = $card.find(".text-success").text(); // e.g., "$250"
    const amount = parseFloat(amountText.replace('$','')); // remove $ and convert to number


    const applicationDTO = {
        jobPostsId: jobId,
        userId: userId,
        jobTitle: jobTitle,
        category: category,
        date: new Date(),
        status: "PENDING",
        amount: amount
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
            $button.text("APPLIED");
            $button.prop("disabled", true);
            $button.removeClass("btn-custom").addClass("btn-secondary");
        },
        error: function () {
            alert("Failed to apply. Try again.");
        }
    });
});

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
        data: { search: searchValue },
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
        error: function(err) {
            console.error("Failed to load filtered jobs", err);
        }
    });
});


/*-------------------------------------------------------------------------------------------*/
function loadMyApplications() {
    const userId = localStorage.getItem("userID");

    $.ajax({
        url: `http://localhost:8080/worker/getApplication/${userId}`,
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const tbody = $("#myApplicationTbody");
            tbody.empty();

            res.data.forEach(app => {
                const row = `
                    <tr>
                        <td>${app.jobTitle}</td>
                        <td><span class="badge bg-primary">${app.category}</span></td>
                        <td>$${app.amount}</td>
                        <td>${new Date(app.date).toLocaleDateString()}</td>
                        <td><span class="badge ${getStatusBadgeClass(app.status)}">${app.status}</span></td>
<!--                        <td><button class="btn btn-sm btn-outline-primary">View</button></td>-->
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
    switch(status.toLowerCase()) {
        case 'pending': return 'bg-warning';
        case 'approved': return 'bg-success';
        case 'rejected': return 'bg-danger';
        default: return 'bg-secondary';
    }
}



