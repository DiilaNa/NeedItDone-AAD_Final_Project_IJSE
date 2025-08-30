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
    currentPage = page
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
                    console.log(user.active)
                    tbody.append(`
                        <tr>
                            <td>${user.username}</td>
                            <td>${user.role}</td>
                            <td>${user.email}</td>
                            <td>${new Date(user.joinDate).toLocaleDateString()}</td>
                         
                            <td>
                                 <button class="btn btn-sm btn-danger disable-btn" data-id="${user.id}">
                                        ${user.status === 'ACTIVE' ? "Disable" : "Enable"}
                                </button>
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

    // Prev link
    container.append(`
        <span class="pagination-link me-3 ${current === 0 ? 'disabled' : ''}"
            onclick="${current > 0 ? `loadUsers(${current - 1})` : ''}">
            ⬅ Prev
        </span>
    `);

    // Current page indicator
    container.append(`
        <span class="pagination-info me-3">
            Page ${current + 1} of ${totalPages}
        </span>
    `);

    // Next link
    container.append(`
        <span class="pagination-link ${current === totalPages - 1 ? 'disabled' : ''}"
            onclick="${current < totalPages - 1 ? `loadUsers(${current + 1})` : ''}">
            Next ➡
        </span>
    `);
}



