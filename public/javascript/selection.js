/**
 * Created by atli on 4.11.2016.
 */
$(document).ready(function() {
    var selection = {};

    //Get location of user
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };

    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success,error,options);
    }

    function success(pos){
        selection['location']={
            longitude: pos.coords.longitude,
            latitude: pos.coords.latitude};
    }
    function error(){
        alert('Location could not be fetched');
    }
    /*
    $("#start-pikk-button").on('click',function() {
        var input = $("<input>")
            .attr("type", "hidden")
            .attr("name", "pikkParam").val(JSON.stringify(selection));
        $("#start-pikk-form").append($(input));
    });*/
});