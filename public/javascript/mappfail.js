script.
    function initMap() {
    if ("#{jaObject.coordinates}" === null){
        return;
    }

    console.log("#{jaObject.coordinates}");
    var name = "#{jaObject.first_name}";
    var lat = parseFloat("#{jaObject.coordinates.lat}");
    var lon = parseFloat("#{jaObject.coordinates.lon}");
    var position = {
        lat: lat,
        lng: lon
    };
    var map = new google.maps.Map(document.getElementById('map'), { center: position, zoom: 15 });
    map.setOptions({draggable: false, zoomControl: false, scrollwheel: false, disableDoubleClickZoom: true});
    var marker = new google.maps.Marker({position: position, map:map, title: name});
}