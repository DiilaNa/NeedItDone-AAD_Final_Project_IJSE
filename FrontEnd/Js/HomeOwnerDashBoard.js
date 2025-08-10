$(document).ready(function () {
    const $circleBtn = $('#circleMenuBtn');
    const $sideNav = $('#sideNav');
    const $backdrop = $('#navBackdrop');
    const $hamburgerIcon = $('#hamburgerIcon');

    // Toggle navigation
    $circleBtn.on('click', function () {
        const isOpen = $sideNav.hasClass('show');

        if (isOpen) {
            closeNav();
        } else {
            openNav();
        }
    });

    // Close nav when clicking backdrop
    $backdrop.on('click', function() {
        closeNav();
    });

    // Close nav when clicking a link
    $('.nav-menu a').on('click', function(e) {
        e.preventDefault();
        const page = $(this).data('page');
        console.log(`Navigating to: ${page}`);
        closeNav();
    });

    function openNav() {
        $sideNav.addClass('show');
        $backdrop.addClass('show');
        $circleBtn.addClass('active');
        $hamburgerIcon.addClass('active');
        $('body').css('overflow', 'hidden');
    }

    function closeNav() {
        $sideNav.removeClass('show');
        $backdrop.removeClass('show');
        $circleBtn.removeClass('active');
        $hamburgerIcon.removeClass('active');
        $('body').css('overflow', 'auto');
    }

    // Keyboard navigation
    $(document).on('keydown', function(e) {
        if (e.key === 'Escape' && $sideNav.hasClass('show')) {
            closeNav();
        }
    });
});