/**
 * Created by atli on 19.11.2016.
 */
$("#get-location").on("click",function(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(consoleIt);
    }
});

function consoleIt(position){
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
}