var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('LoginController', function ($scope, $http, $window, $rootScope, $location) {

    /////////Start Get Geo Location//////
    $scope.Latitude = "";
    $scope.Longitude = "";
    $scope.LocationErrorMSG = "";
    GetCurrentLocation();
    /////////End Get Geo Location//////

    var path = $location.$$path.split("/");
    $scope.reset_password_token = path[path.length - 1];

    var thequerystring = getParameterByName("email");
    console.log(thequerystring);
    if (thequerystring !== undefined && thequerystring !== null && thequerystring !== "") {
        Login(thequerystring, "LoginWithAdmin", 0);
    }

    $scope.Login = function (IsLoginWithFaceBook) {
        Login($scope.emailid, $scope.password, IsLoginWithFaceBook);
    };

    $scope.checkedRememberPassword = false;
    if (localStorage.getItem("WrememberPassword") == "true") {
        $scope.checkedRememberPassword = true;
        $scope.rememberPassword = true;
        $scope.emailid = localStorage.getItem("rememberUserId");
        $scope.password = localStorage.getItem("rememberPassword");
    }

    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, "\\$&");
        var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, " "));
    }

    function Login(userid, password, IsLoginWithFaceBook) {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                userid: userid,
                password: password,
                latitude: $scope.Latitude,
                longitude: $scope.Longitude,
                IsLoginWithFaceBook: IsLoginWithFaceBook,
                name: "",
                facebook_id: ""
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/Login',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        if (details.IsSuccess === 1) {
                            //FB.logout();
                            if ($scope.rememberPassword == true) {
                                localStorage.setItem("WrememberPassword", true);
                                localStorage.setItem("rememberUserId", $scope.emailid);
                                localStorage.setItem("rememberPassword", $scope.password);
                            }
                            else {
                                localStorage.setItem("WrememberPassword", false);
                                localStorage.removeItem("rememberUserId");
                                localStorage.removeItem("rememberPassword");
                            }
                            $window.location.href = '/deals';
                        }
                        else { GetAlert(details.ResponseMSG, 'error'); }
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
    }

    $scope.ForgotPassword = function () {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                userid: $scope.femailid
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/ForgotPassword',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        GetAlert(details.ResponseMSG, details.ResponseType, "/login");
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

    $scope.ChangePassword = function () {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                token: $scope.reset_password_token,
                password: $scope.password,
                confpassword: $scope.cpassword
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/ChangePassword',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        if (_data[0].IsSuccess == 1) {
                            GetAlert(details.ResponseMSG, details.ResponseType, "/login");
                        }
                        else {
                            GetAlert(details.ResponseMSG, details.ResponseType);
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

    //$scope.setRememberPassword = function () {
    //    if ($scope.rememberPassword == true) {
    //        if ($scope.emailid !== undefined && $scope.password !== undefined) {
    //            localStorage.setItem("userId", $scope.emailid);
    //            localStorage.setItem("password", $scope.password);
    //        }
    //    }
    //    //alert($scope.rememberPassword)
    //}
});