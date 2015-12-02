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
    .then(function(response) {
        $scope.graficoVolume = response.data[0].volume;
        $scope.chart = loadLiquidFillGauge("graficoVolume", $scope.graficoVolume, $scope.chartConfig);
    })
});


