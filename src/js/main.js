new WOW().init();
$(function () {

    /* burger */

    var $burger = $('.menu-burger'),
        $header = $('.header-menu'),
        $main = $('.blur'),
        $mainHeader = $('.main-header'); // variable for header - change BG on scroll

    $burger.click(function () {
        $header.toggleClass('show-menu');
        $(this).toggleClass('show');
        $main.toggleClass('active');
    })

    $main.click(function () {
        $header.removeClass('show-menu');
        $burger.removeClass('show');
        $main.removeClass('active');
    })

    $(window).keypress(function (e) {
        if (e.originalEvent.keyCode == 27) {
            $header.removeClass('show-menu');
            $burger.removeClass('show');
            $main.removeClass('active');

        }
    });
    /* end burger*/

    /* change bg on smartphone on click*/
    var screens = ['url(./img/start-screen.jpg)', 'url(./img/screen1.jpg)'],
        $phoneScreen = $('.phone-bg'),
        bgIter = 0;

    $('.phone-button').click(function () {
        console.log(bgIter);
        if (bgIter == 0) {
            ++bgIter;
        } else if (bgIter >= screens.length) {
            bgIter = 0;
        }
        $phoneScreen.attr('data-screen', bgIter);
        $phoneScreen.css('background-image', screens[bgIter]);
        bgIter++;
    })
    /* end */

    /* smooth scroll to element from menu */

    var headerHeight = $('.main-header').height();
    var $links = $('.menu-item a');

    $links.click(function (e) {
        e.preventDefault();
        $links.parent().removeClass('active');
        var target = $(this).attr('href');
        $(this).parent().addClass('active');
        console.log(target);
        $('html, body').animate({
            scrollTop: $(target).offset().top - headerHeight * 1.3
        }, 600);
    });

    /* end smooth scroll*/

    /* on scroll events*/
    var body = document.body,
        timer;
    $(window).on('scroll', function () {
        /* no-hover optimization */
        clearTimeout(timer);
        if (!body.classList.contains('no-hover')) {
            body.classList.add('no-hover');
        }

        timer = setTimeout(function () {
            body.classList.remove('no-hover')
        }, 400);
        /* end no-hover optimization */

    /* change bg on smartphone*/

    var scroll = $(window).scrollTop(),
        target = $('#features').offset().top;
    if (scroll >= target) {
        $phoneScreen.css('background-image', screens[bgIter]);
    } else {
        $phoneScreen.removeAttr('style');
    }

    /* end change bg */

    /* switching active class */

    $links.each(function () {
        var selector = $(this).attr('href');
        if (scroll >= $(selector).offset().top - headerHeight - 10) {
            $links.parent().removeClass('active');
            $(this).parent().addClass('active');
        }
    })
    /* end switching class */

    /* changing header bg */
    if (scroll >= $('#home').height()) {
        $mainHeader.css('background-color', 'rgba(16,22,54,0.9)');
    } else {
        $mainHeader.removeAttr('style');
    }
})
/* end scroll*/

function filter(dataSelector) {
    var $work = $('[data-work]');
    if (dataSelector == 'all') {
        $work.slideDown();
    } else {
        $work.filter('[data-work="' + dataSelector + '"]').slideDown();
        $work.filter(':not([data-work="' + dataSelector + '"])').slideUp();
    }
};
// if ($workData == dataSelector) {
//     $work.slideDown();
// }
// else if (dataSelector == 'all') {
//     $work.slideDown();
// }
// else {AA
//     $work.slideUp();
// }
// $work.filter('[data-work]').slideDown();
// $work.filter(':not([data-work])').slideUp();

var $filterBtn = $('[data-filter]');
$filterBtn.click(function () {
var filteredWork = $(this).attr('data-filter');
filter(filteredWork);
})
})