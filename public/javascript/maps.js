$("#map").click(function() {
    var name = $("#map").attr('name');
    var lat = $("#map").attr('lat');
    var lon = $("#map").attr('lon');
    window.open('/map/?lat='+lat+"&lon="+lon+"&name="+name, '_blank');
});
