/**
 * Created by Matthías on 19.11.2016.
 */

var first_click = false;
var second_click = false;
var third_click = false;

$(document).ready(function(){
    $('.first-check').click(function(){
        first_click = !first_click;
        if(first_click===true)
        {
            $('.first-checkpoint').addClass('active');
            $('.first-icon').addClass('fa-close');
            $('.first-icon').removeClass('fa-check');
        }
        else
        {
            $('.first-checkpoint').removeClass('active');
            $('.first-icon').addClass('fa-check');
            $('.first-icon').removeClass('fa-close');
        }
    })

    $('.second-check').click(function(){
        second_click = !second_click;
        if(second_click===true)
        {
            $('.second-checkpoint').addClass('active');
            $('.second-icon').addClass('fa-close');
            $('.second-icon').removeClass('fa-check');
        }
        else
        {
            $('.second-checkpoint').removeClass('active');
            $('.second-icon').addClass('fa-check');
            $('.second-icon').removeClass('fa-close');
        }
    })

    $('.third-check').click(function(){
        third_click = !third_click;
        if(third_click===true)
        {
            $('.third-checkpoint').addClass('active');
            $('.third-icon').addClass('fa-close');
            $('.third-icon').removeClass('fa-check');
        }
        else
        {
            $('.third-checkpoint').removeClass('active');
            $('.third-icon').addClass('fa-check');
            $('.third-icon').removeClass('fa-close');
        }
    })


})

