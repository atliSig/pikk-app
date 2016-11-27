/**
 * Created by atli on 4.11.2016.
 */
$(document).ready(function() {
    $('.choice-button').prop('disabled', false);
    $('#insert-wrapper').css({'display':'none'});
    $('.remove-me').remove();
    var count=0;
    //Default location to fall on is
    //downtown Reykjavik
    //Get location of user
    $('#location-button').on('click',function(){
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(success,error,options);
        }

        function success(pos){
            userInput.location={
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            };
        }
        function error(){
            console.log('Location could not be fetched');
        }
    });

    //Add item to list
    $('.choice-button').on('click',function(){
        $('#insert-wrapper').css({'display':'block'});
        var sel = $('#hide-it').clone();
        sel.text($(this).text());
        sel.removeAttr('id');
        sel.addClass('added-tag');
        var icon = $('<i></i>');
        icon.addClass('fa fa-close side-icon');
        sel.append(icon);
        sel.val($(this).attr('value'));
        $('#insert-area').append(sel);
        count++;
        if(count>=3){
            $('.choice-button').prop('disabled', true);
        }
    });

    //Remove item from list
    $('#insert-area').on('click','.added-tag',function(){
        $(this).remove();
        count--;
        if(count<3){
            $('.choice-button').prop('disabled', false);
        }
    });


    $("#start-pikk-button").on('click',function() {
        var userInput = {};
        userInput.location={
            latitude:'64.147410',
            longitude:'-21.936253'
        };
        var selection=[];
        $(".added-tag").each(function(index){
            selection.push($(this).val());
        });
        userInput.selection=selection;
        var input = $("<input>")
            .addClass('remove-me')
            .attr("type", "hidden")
            .attr("name", "userinput").val(JSON.stringify(userInput));
        $("#start-pikk-form").append($(input));
    });
});