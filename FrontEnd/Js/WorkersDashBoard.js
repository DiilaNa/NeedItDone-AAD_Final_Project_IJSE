$(document).ready(function() {
    sideNav();
    loadUserDetails();
    loadLatestJobs();
});
/*---------------------SIGN OUT Button---------------------------*/
$("#logoutBTN").on('click',function () {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role")
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
    $.ajax({
        url: "http://localhost:8080/worker/latest",
        type: "GET",
        headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
        },
        success: function (res) {
            const jobsContainer = $("#jobs-container");
            jobsContainer.empty();
            res.data.forEach(job => {
                const cardHtml = `
                    <div class="col-md-6 mb-3">
                         <div class="card job-card shadow-sm" data-id="${job.id}">
                           <div class="card-body">
                          <h5 class="card-title">${job.jobTitle}</h5>
                              <p class="card-text">${job.description}</p>
                              <div class="d-flex justify-content-between align-items-center mb-2">
                               <span class="badge bg-primary">${job.categoryName || 'General'}</span>
                                <span class="text-success fw-bold">$${job.cost}</span>
                             </div>
                             <div class="d-flex justify-content-between align-items-center mb-3">
                              <small class="text-muted"><i class="fas fa-map-marker-alt"></i> ${job.location}</small>
                                  <small class="text-muted"><i class="fas fa-clock"></i> ${job.daysSincePosted > 0 ? 'Posted ' + job.daysSincePosted + ' days ago' : 'Posted Today'}</small>
                            </div>
                             <button class="btn btn-custom btn-sm w-100 apply-job">Apply Now</button>
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