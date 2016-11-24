/**
 * Created by Matthías on 23.11.2016.
 */

$('document').ready(function(){
    var windowsize = $(window).width();

    $(window).resize(function() {
        windowsize = $(window).width();
    });

    if (windowsize < 992) {

        $('.dropdown-menu').removeClass('dropdown-menu-right');
        $('.dropdown-menu').addClass('dropdown-menu-left');

    }
});