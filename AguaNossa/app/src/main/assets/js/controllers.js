angular.module('AguaNossa.controllers', [])

.controller('GraficoVolume', function ($scope, $rootScope, $http) {
    $scope.graficoVolume = 0.0;
    $scope.chartConfig = liquidFillGaugeDefaultSettings();
    $scope.chartConfig.circleColor = "#FF7777";
    $scope.chartConfig.textColor = "#FF4444";
    $scope.chartConfig.waveTextColor = "#FFAAAA";
    $scope.chartConfig.circleThickness = 0.1;
    $scope.chartConfig.textVertPosition = 0.5;
    $scope.chartConfig.waveAnimateTime = 1500;
    $scope.chartConfig.waveCount = 3;

    $http.get("https://contribuatestes.lsd.ufcg.edu.br/aguanossa-backend/get_volume_boqueirao")
        .then(function (response) {
            $scope.graficoVolume = response.data;
            $scope.chart = loadLiquidFillGauge("graficoVolume", $scope.graficoVolume, $scope.chartConfig);

        })

})

.controller('MapaDeRegistros', function ($scope, $rootScope, $http) {

    $scope.faltasDeAgua = 0;
    $scope.vazamentos = 0;
    $scope.notifications = {};
    $scope.visualizar = {};
    $rootScope.isOn = true;

    $scope.initialize = function () {

        setInterval($scope.loadNotifications, UPDATE_INTERVAL);
        $scope.loadNotifications();

        if ($rootScope.isOn) {
            googleMapsInit();
        }

        $scope.visualizar.vazamentos = true;
        $scope.visualizar.faltasDeAgua = true;
    };

    $scope.loadNotifications = function () {

        $scope.checkConnection();

        deleteMarkers();
        lat_lng_array = {
            faltaDeAgua: [],
            vazamentos: []
        };

        $http.get("https://contribuatestes.lsd.ufcg.edu.br/aguanossa-backend/get_notifications").then(function (response) {

            $scope.notifications.faltaDeAgua = response.data;

            for (var i = 0; i < $scope.notifications.faltaDeAgua.length; i++) {
                var notification = $scope.notifications.faltaDeAgua[i];
                if (notification.lat_lng == "") {
                    continue;
                }
                lat_lng_array.faltaDeAgua.push(processLatAndLng(notification.lat_lng));
            }

            var pointArray = new google.maps.MVCArray(lat_lng_array.faltaDeAgua);

            heatmap = new google.maps.visualization.HeatmapLayer({
                data: pointArray,
                radius: 30
            });

            if ($scope.visualizar.faltasDeAgua) {
                placeFaltaMarkers();
            }

            $scope.faltasDeAgua = $scope.notifications.faltaDeAgua.length;

        });

        $http.get("https://contribuatestes.lsd.ufcg.edu.br/aguanossa-backend/get_notifications_vazamentos").then(function (response) {

            $scope.notifications.vazamentos = response.data;

            for (var i = 0; i < $scope.notifications.vazamentos.length; i++) {
                var notification = $scope.notifications.vazamentos[i];
                if (notification.lat_lng == "") {
                    continue;
                }
                lat_lng_array.vazamentos.push(processLatAndLng(notification.lat_lng));
            }

            if ($scope.visualizar.vazamentos) {
                placeVazamentoMarkers();
            }

            $scope.vazamentos = $scope.notifications.vazamentos.length;

            //$scope.isLoadingVazamentos = false;

        });

    }

    $scope.checkConnection = function () {

        $http.get("https://contribuatestes.lsd.ufcg.edu.br/aguanossa-backend/get_volume_boqueirao").
        then(function (response) {
            if ((response.status >= 200) && (response.status <= 304)) {
                $rootScope.isOn = true;
            } else {
                $rootScope.isOn = false;
            }
        }, function (response) {
            $rootScope.isOn = false;
        })
    }

    $rootScope.$watch("isOn", function handle(newValue, oldValue) {
        if (newValue && (!oldValue)) {
            location.reload();
        }
    });

    $scope.$watch("visualizar.faltasDeAgua",
        function handle(newValue, oldValue) {
            if (newValue) {
                placeFaltaMarkers();

            } else {
                deleteMarkers();
                if ($scope.visualizar.vazamentos) {
                    placeVazamentoMarkers();
                }
            }
        }
    );

    $scope.$watch("visualizar.vazamentos",
        function handle(newValue, oldValue) {
            if (newValue) {
                placeVazamentoMarkers();

            } else {
                deleteMarkers();
                if ($scope.visualizar.faltasDeAgua) {
                    placeFaltaMarkers();
                }
            }
        }
    );

    $scope.initialize();

})

