/**
 * Created by atli on 4.11.2016.
 */
$(document).ready(function() {
    var userInput = {};
    var selection = [];
    //Default location to fall on is
    //downtown Reykjavik
    userInput.location={
        latitude:'64.147410',
        longitude:'-21.936253'
    }
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

    $('.choice-button').on('click',function(){
        selection.push($(this).attr('value'));
    });

    $("#start-pikk-button").on('click',function() {
        userInput.selection=selection;
        var input = $("<input>")
            .attr("type", "hidden")
            .attr("name", "userinput").val(JSON.stringify(userInput));
        $("#start-pikk-form").append($(input));
    });
});