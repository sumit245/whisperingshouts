var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('LoginController', function ($scope, $http, $window, $rootScope, $location) {


    /////////Start Get Geo Location//////
    $scope.Latitude = "";
    $scope.Longitude = "";
    $scope.LocationErrorMSG = "";
    //GetCurrentLocation();
    /////////End Get Geo Location//////

    $scope.AdminLogin = function () {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                userid: $scope.emailid,
                password: $scope.password
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/AdminLogin',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    if (data.data.d === "fail") {
                        ajaxindicatorstop();
                        GetAlert("Invalid user name/ password", "error");
                    }
                    else if (data.data.d === "success") {

                        if ($scope.emailid == "richatiwari160@gmail.com") {
                            $window.location.href = '/blog';
                        }
                        else {
                            $window.location.href = '/dashboard';
                        }
                    }
                }),
                error(function (ex) {
                    ajaxindicatorstop();
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    };

    function GetCurrentLocation() {
        getLocation();
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(showPosition, showError);
            } else {
                $scope.LocationErrorMSG = "Geolocation is not supported by this browser.";
                console.log($scope.LocationErrorMSG);
            }
        }
        function showPosition(position) {
            $scope.Latitude = position.coords.latitude;
            $scope.Longitude = position.coords.longitude;

            //console.log($scope.Latitude);
            //console.log($scope.Longitude);

            //x.innerHTML = "Latitude: " + position.coords.latitude +
            //    "<br>Longitude: " + position.coords.longitude;
        }
        function showError(error) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    $scope.LocationErrorMSG = "User denied the request for Geolocation.";
                    break;
                case error.POSITION_UNAVAILABLE:
                    $scope.LocationErrorMSG = "Location information is unavailable.";
                    break;
                case error.TIMEOUT:
                    $scope.LocationErrorMSG = "The request to get user location timed out.";
                    break;
                case error.UNKNOWN_ERROR:
                    $scope.LocationErrorMSG = "An unknown error occurred.";
                    break;
            }
            console.log($scope.LocationErrorMSG);
        }
    }
});