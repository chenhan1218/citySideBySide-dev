var lat1 = 35.693;
var lng1 = 139.750;
var lat2 = 25.0631;
var lng2 = 121.5335;
var city1 = "Tokyo";
var city2 = "Taipei";
var zoom = 12;


const provider = new GeoSearch.OpenStreetMapProvider();

var params = window.location.href.split("#");
if (params.length >= 2) {
    params = params[1].split(";");
    if (params.length >= 7) {
        zoom = parseInt(params[0]);
        lat1 = parseFloat(params[1]);
        lng1 = parseFloat(params[2]);
        lat2 = parseFloat(params[3]);
        lng2 = parseFloat(params[4]);
        city1 = decodeURIComponent(params[5]);
        city2 = decodeURIComponent(params[6]);
    }
}

var basemapA = L.tileLayer(osmUrl, {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
});
var basemapB = L.tileLayer(osmUrl, {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
});

var mapA = L.map('mapA', {
    layers: [],
    center: new L.latLng(lat1, lng1),
    zoom: zoom
});
var mapB = L.map('mapB', {
    layers: [],
    center: new L.latLng(lat2, lng2),
    zoom: zoom
});
var osmUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
var tilesA = L.tileLayer(osmUrl, {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
});
var tilesB = L.tileLayer(osmUrl, {
    maxZoom: 18,
    attribution: '© OpenStreetMap'
});
tilesA.addTo(mapA);
tilesB.addTo(mapB);


const searchA = new GeoSearch.GeoSearchControl({
    provider: provider,
    style: 'bar',
    retainZoomLevel: true,
    searchLabel: ''
});
mapA.addControl(searchA);
L.control.scale({
    position: 'bottomright'
}).addTo(mapA);
searchA.searchElement.input.value = city1;

const searchB = new GeoSearch.GeoSearchControl({
    provider: provider,
    style: 'bar',
    retainZoomLevel: true,
    searchLabel: ''
});
mapB.addControl(searchB);
L.control.scale({
    position: 'bottomright'
}).addTo(mapB);
searchB.searchElement.input.value = city2;

mapA.on('moveend', function (e) {
    updateURL(mapA.getZoom(), mapA.getCenter(), mapB.getCenter())
});
mapA.on('zoom', function (e) {
    mapB.setView(mapB.getCenter(), mapA.getZoom());
});

mapB.on('moveend', function (e) {
    updateURL(mapA.getZoom(), mapA.getCenter(), mapB.getCenter())
});
mapB.on('zoom', function (e) {
    mapA.setView(mapA.getCenter(), mapB.getZoom());
});

function updateURL(zoom, a_center, b_center) {
    var params =
        zoom + ";" +
        parseFloat(a_center.lat.toFixed(4)) + ";" +
        parseFloat(a_center.lng.toFixed(4)) + ";" +
        parseFloat(b_center.lat.toFixed(4)) + ";" +
        parseFloat(b_center.lng.toFixed(4)) + ";" +
        searchA.searchElement.input.value + ";" +
        searchB.searchElement.input.value

    var url = window.location.href.split("#");
    url = url[0].split("?");
    url = url[0] + "#" + params;

    window.location.href = url;
    console.log(url)

    window.document.title = "City Side By Side: " + searchA.searchElement.input.value + " and " + searchB.searchElement.input.value + "!";
}
