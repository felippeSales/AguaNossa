var app = angular.module('AguaNossa', ['angularSpinner', 'AguaNossa.controllers']);

var heatmap;
var markers = [];
var lat_lng_array = {
    faltaDeAgua: [],
    vazamentos: []
};

var FALTA_MARKER_ICON = "img/aguanossa-marker.png";
var VAZAMENTO_MARKER_ICON = "img/vazamento-marker.png";
var UPDATE_INTERVAL = 10000;

app.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setTheme('bigWhite', {
        color: 'white',
        radius: 15,
        lines: 15,
        length: 20
    });
}]);

function googleMapsInit() {
    var mapOptions = {
        zoom: 13,
        center: new google.maps.LatLng(-7.220, -35.886) //	centro de campina grande
    };

    map = new google.maps.Map(document.getElementById('map-canvas'),
        mapOptions);

    var showHeatMap = document.createElement('div');
    //var homeControl = new HeatMapControl(showHeatMap, map);
    var showCircleMap = document.createElement('div');
    //var circleControl = new CircleMapControl(showCircleMap, map);

    showHeatMap.index = 1;
    showCircleMap.index = 1;

    // map.controls[google.maps.ControlPosition.TOP_RIGHT].push(showCircleMap);
    //map.controls[google.maps.ControlPosition.TOP_RIGHT].push(showHeatMap);
}

function HeatMapControl(controlDiv, map) {
    // Set CSS styles for the DIV containing the control
    // Setting padding to 5 px will offset the control
    // from the edge of the map
    controlDiv.style.padding = '4px';

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'white';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '1px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Clique para mostrar o mapa de intensidade';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'questrialRegular';
    controlText.style.fontSize = '15px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = '<b>Mapa de Intensidade</b>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to
    // Chicago
    google.maps.event.addDomListener(controlUI, 'click', function () {
        toggleHeatmap();
    });
}

function CircleMapControl(controlDiv, map) {
    // Set CSS styles for the DIV containing the control
    // Setting padding to 5 px will offset the control
    // from the edge of the map
    controlDiv.style.padding = '4px';

    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'white';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '1px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Clique para mostrar o mapa de círculos gradientes';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'questrialRegular';
    controlText.style.fontSize = '15px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = '<b>Mapa de Círculos</b>';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to
    // Chicago
    google.maps.event.addDomListener(controlUI, 'click', function () {
        toggleCirclemap();
    });
}

function toggleHeatmap() {
    if (heatmap.getMap() == null) {
        deleteMarkers();
        heatmap.setMap(map);
    } else {
        heatmap.setMap(null);
        placeFaltaMarkers();
        placeVazamentoMarkers();
    }
}

function toggleCirclemap() {
    heatmap.setMap(null);
    if (markers.length != 0 && markers[0].type == "circle") {
        deleteMarkers();
        placeFaltaMarkers();
    } else {
        deleteMarkers();
        placeCircles();
    }
}

function processLatAndLng(stringLatAndLng) {
    var lat_lng = stringLatAndLng.split("/");
    var lat = parseFloat(lat_lng[0].trim());
    var lng = parseFloat(lat_lng[1].trim());
    return new google.maps.LatLng(lat, lng);
}

function placeCircles() {
    for (var i = 0; i < lat_lng_array.faltaDeAgua.length; i++) {
        markers.push(placeCircle(lat_lng_array.faltaDeAgua[i]));
    }
}

function placeCircle(location) {
    var circulo = {
        strokeColor: '#d39b07',
        strokeOpacity: 0.8,
        strokeWeight: 1.2,
        fillColor: '#d39b07',
        fillOpacity: 0.2,
        map: map,
        center: location,
        radius: 125,
        type: "circle"
    };
    return new google.maps.Circle(circulo);
}

function placeVazamentoMarkers() {
    for (var i = 0; i < lat_lng_array.vazamentos.length; i++) {
        markers.push(placeVazamentoMarker(lat_lng_array.vazamentos[i]));
    }
}

function placeFaltaMarkers() {
    for (var i = 0; i < lat_lng_array.faltaDeAgua.length; i++) {
        markers.push(placeFaltaMarker(lat_lng_array.faltaDeAgua[i]));
    }
}

function placeFaltaMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        draggable: false,
        map: map,
        //animation: google.maps.Animation.DROP,
        icon: FALTA_MARKER_ICON,
        //title : "Hello World!"
        type: "default"
    });

    return marker;
}

function placeVazamentoMarker(location) {

    var marker = new google.maps.Marker({
        position: location,
        draggable: false,
        map: map,
        //animation: google.maps.Animation.DROP,
        icon: VAZAMENTO_MARKER_ICON,
        //title : "Hello World!"
        type: "default"
    });
    return marker;
}

function setAllMap(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}

function clearMarkers() {
    setAllMap(null);
}

function deleteMarkers() {
    clearMarkers();
    markers = [];
}