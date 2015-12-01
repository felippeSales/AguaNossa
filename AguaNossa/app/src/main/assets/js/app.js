var app = angular.module('AguaNossa', []);


app.controller('GraficoVolume', function ($scope, $rootScope) {
    $scope.chartConfig = liquidFillGaugeDefaultSettings();
    $scope.chartConfig.circleColor = "#FF7777";
    $scope.chartConfig.textColor = "#FF4444";
    $scope.chartConfig.waveTextColor = "#FFAAAA";
    $scope.chartConfig.circleThickness = 0.1;
    $scope.chartConfig.textVertPosition = 0.5;
    $scope.chartConfig.waveAnimateTime = 1500;
    $scope.chartConfig.waveCount = 3;
    $scope.chart = loadLiquidFillGauge("graficoVolume", 13.8, $scope.chartConfig);
    
});
