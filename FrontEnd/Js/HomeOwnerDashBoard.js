$(document).ready(function () {
    loadUserDetails();
    sideNav();
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
    console.log("clkk")
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



