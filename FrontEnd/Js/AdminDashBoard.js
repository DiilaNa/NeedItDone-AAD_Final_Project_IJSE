$(document).ready(function() {
    sideNavBar();
    loadUsers();

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
                console.log(users)
                users.forEach(user => {
                    console.log(user)
                    tbody.append(`
                        <tr>
                            <td>${user.username}</td>
                            <td>${user.role}</td>
                            <td>${user.email}</td>
                            <td>${new Date(user.joinDate).toLocaleDateString()}</td>
                         
                            <td>
                                <button class="btn btn-sm btn-danger">Delete</button>
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

    for (let i = 0; i < totalPages; i++) {
        container.append(`
            <button class="btn btn-sm ${i === current ? 'btn-primary' : 'btn-outline-primary'} me-1"
                onclick="loadUsers(${i})">
                ${i + 1}
            </button>
        `);
    }
}

