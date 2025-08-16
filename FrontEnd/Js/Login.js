/*--------Navigate to SignUp Page--------------*/
function navigateTo(page) {
    if (page==='register'){
        window.location.href="SignUpPage.html"
    }
}


$(".form").on('submit',function () {
    e.preventDefault();
    console.log("ebuna")
    window.location.href="HomeOwnerDashBoard.html"
})

$(document).ready(function() {
    $("#loginBtn").on('click', function(e) {
        e.preventDefault();
        console.log("ebuna s");
        window.location.href = "HomeOwnerDashBoard.html";
    });
});



