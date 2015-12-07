var app = angular.module('AguaNossa', []);


app.controller('GraficoVolume', function ($scope, $rootScope, $http) {
    $scope.graficoVolume = 0.0;
    $scope.chartConfig = liquidFillGaugeDefaultSettings();
    $scope.chartConfig.circleColor = "#FF7777";
    $scope.chartConfig.textColor = "#FF4444";
    $scope.chartConfig.waveTextColor = "#FFAAAA";
    $scope.chartConfig.circleThickness = 0.1;
    $scope.chartConfig.textVertPosition = 0.5;
    $scope.chartConfig.waveAnimateTime = 1500;
    $scope.chartConfig.waveCount = 3;

    $http.get("http://aguaeco-celiobarros.rhcloud.com/volume_boqueirao")
        .then(function (response) {
            $scope.graficoVolume = response.data[0].volume;
            $scope.chart = loadLiquidFillGauge("graficoVolume", $scope.graficoVolume, $scope.chartConfig);
        })
});

app.controller('MapaDeRegistros', function ($scope, $rootScope) {
    $scope.map = "";
    $scope.heatmap = "";
    $scope.markers = [];
    $scope.lat_lng_array = [];
    $scope.notifications = [];

    $scope.DEFAULT_MARKER_ICON = "img/aguanossa-marker.png";
    $scope.UPDATE_INTERVAL = 300000;

    $scope.initialize = function () {
        $scope.googleMapsInit();
        //$scope.loadNotifications();
        //$scope.setInterval($scope.loadNotifications, $scope.UPDATE_INTERVAL);

    };

    $scope.googleMapsInit = function () {
        var mapOptions = {
            zoom: 13,
            center: new google.maps.LatLng(-7.220, -35.886) //	centro de campina grande
        };

        $scope.map = new google.maps.Map(document.getElementById('map-canvas'),
            mapOptions);

        var showHeatMap = document.createElement('div');
        //var homeControl = new HeatMapControl(showHeatMap, map);
        var showCircleMap = document.createElement('div');
       // var circleControl = new CircleMapControl(showCircleMap, map);

        showHeatMap.index = 1;
        showCircleMap.index = 1;

        $scope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(showCircleMap);
        $scope.map.controls[google.maps.ControlPosition.TOP_RIGHT].push(showHeatMap);
    };


    $scope.initialize();

});