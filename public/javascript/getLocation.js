/**
 * Created by atli on 19.11.2016.
 */


if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(success,error,options);
}

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function success(position){
    //Here we have access to position.coords.latitude
    //and position.coords.longitude
}

function error(){
    console.log('whoops');
}

/*$("#get-location").on("click",function(){
     if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(success,error,options);
     }
 });*/
