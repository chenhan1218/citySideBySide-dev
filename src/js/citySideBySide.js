var lat1 = 35.693;
var lng1 = 139.750;
var lat2 = 25.0631;
var lng2 = 121.5335;
var city1 = "Tokyo";
var city2 = "Taipei";
var zoom = 12;

var params = window.location.href.split("#");
if (params.length >= 2) {
    params = params[1].split(";");
    if (params.length >= 7) {
        zoom = parseInt(params[0]);
        lat1 = parseFloat(params[1]);
        lng1 = parseFloat(params[2]);
        lat2 = parseFloat(params[3]);
        lng2 = parseFloat(params[4]);
        city1 = unescape(params[5]);
        city2 = unescape(params[6]);
    }
}

var osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
var basemapA = new L.TileLayer(osmUrl, {
    maxZoom: 18
});
var basemapB = new L.TileLayer(osmUrl, {
    maxZoom: 18
});

var mapA = new L.Map('mapA', {
    layers: [basemapA],
    center: new L.LatLng(lat1, lng1),
    zoom: zoom
});

var mapB = new L.Map('mapB', {
    layers: [basemapB],
    center: new L.LatLng(lat2, lng2),
    zoom: zoom
});

var googleProvider = new L.GeoSearch.Provider.Google();

var geosearchA = new L.Control.GeoSearch({
    provider: googleProvider
});
geosearchA.addTo(mapA);
L.control.scale({
    position: 'bottomright'
}).addTo(mapA);
geosearchA._searchbox.value = city1

var geosearchB = new L.Control.GeoSearch({
    provider: googleProvider
});
geosearchB.addTo(mapB);
L.control.scale({
    position: 'bottomright'
}).addTo(mapB);
geosearchB._searchbox.value = city2

mapA.on('moveend', function(e) {
    mapB.setView(mapB.getCenter(), mapA.getZoom());
    updateURL(mapA.getZoom(), mapA.getCenter(), mapB.getCenter())
});

mapB.on('moveend', function(e) {
    mapA.setView(mapA.getCenter(), mapB.getZoom());
    updateURL(mapA.getZoom(), mapA.getCenter(), mapB.getCenter())
});

function updateURL(zoom, a_center, b_center) {
    var params = zoom + ";" + parseFloat(a_center.lat.toFixed(4)) + ";" + parseFloat(a_center.lng.toFixed(4)) + ";" + parseFloat(b_center.lat.toFixed(4)) + ";" + parseFloat(b_center.lng.toFixed(4)) + ";" + geosearchA._searchbox.value + ";" + geosearchB._searchbox.value

    var url = window.location.href.split("#");
    url = url[0].split("?");
    url = url[0] + "#" + params;

    window.location.href = url;

    window.document.title = "City Side By Side: " + geosearchA._searchbox.value + " and " + geosearchB._searchbox.value + "!";
}
