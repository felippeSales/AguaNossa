var app = angular.module('AguaNossa', ['angularSpinner', 'AguaNossa.controllers','ui.router']);

var heatmap;
var markers = [];
var lat_lng_array = {
    faltaDeAgua: [],
    vazamentos: []
};

var FALTA_MARKER_ICON = "img/aguanossa-marker.png";
var VAZAMENTO_MARKER_ICON = "img/vazamento-marker.png";
var UPDATE_INTERVAL = 10000;


app.config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('volume', {
        url: '/',
        templateUrl: 'templates/volume.html'   
    })
    
    .state('mapa', {
        url: '/mapa',
        templateUrl: 'templates/mapa.html'   
    })
    
    .state('noticias', {
        url: '/noticias',
        templateUrl: 'templates/noticias.html'   
    })
    
    .state('sobre', {
        url: '/sobre',
        templateUrl: 'templates/sobre.html'   
    })
    
    ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/');
});

app.config(['usSpinnerConfigProvider', function (usSpinnerConfigProvider) {
    usSpinnerConfigProvider.setTheme('bigWhite', {
        color: 'white',
        radius: 15,
        lines: 15,
        length: 20
    });
}]);
