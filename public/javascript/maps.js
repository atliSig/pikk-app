function initMap(jaObject) {
    var position = {
        lat: jaObject.coordinates.lat,
        lng: jaObject.coordinates.lon
    };
    map = new google.maps.Map(document.getElementById('map'), {
        center: position, zoom: 15});
    var marker = new google.maps.Marker({position:position, map:map, title: jaObject.first_name})}