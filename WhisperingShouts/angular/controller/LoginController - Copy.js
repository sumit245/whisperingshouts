var MyApp = angular.module('IndependenceDay');

MyApp.controller('LoginController', function ($scope, $http, $window, $rootScope, $location) {

    //localStorage.clear();
    //sessionStorage.clear();
    $scope._IsOTPSent = false;
    $scope._IsLogin = false;


    //const proxyurl = "https://cors-anywhere.herokuapp.com/";
    //const url = "http://viswa.com:3010/airtelMall/addCategory";

    //var settings = {
    //    "async": true,
    //    "crossDomain": true,
    //    "url": proxyurl + url,
    //    "method": "POST",
    //    "headers": {
    //        "Content-Type": "application/json",
    //        "cache-control": "no-cache"
    //        //"X-Requested-With": "XMLHttpRequest"
    //    },
    //    "processData": false,
    //    "data": "{\r\n\"category_id\": 10,\r\n\"category_name\": \"CTO1\"\r\n}"
    //};

    //$.ajax(settings).done(function (response) {
    //    console.log(response);
    //});

    ////var settings = {        
    ////    "async": true,
    ////    "crossDomain": true,
    ////    "url": proxyurl + url,
    ////    "method": "POST",
    ////    "headers": {
    ////        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1Y2ExYTE1MjQ4MWRiNzdiNGIwMWVlN2QiLCJpYXQiOjE1NTYwODQ3MDYsImV4cCI6MTU1NjY4OTUwNn0.oW0fl98PlSSZ8nD8Kf-rEcWqFmtEq--AyMhXVZk0Zis",
    ////        "content-type": "application/json",
    ////        "cache-control": "no-cache"            
    ////    },
    ////    "processData": false,
    ////    "data": "{\r\n\"mobileNumber\": \"454354354354354\"\r\n}"
    ////};

    ////$.ajax(settings).done(function (response) {
    ////    console.log(response);
    ////});

    ////const proxyurl = "https://cors-anywhere.herokuapp.com/";
    ////const url = "http://tciapidev.akkado.in/travelClinic/checkCustomer"; // site that doesn’t send Access-Control-*
    ////fetch(proxyurl + url)
    ////    .then(response => response.text())
    ////    .then(contents => console.log(contents))
    ////    .catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));

    $scope.GenerateOTP = function () {

        localStorage.clear();
        sessionStorage.clear();

        if ($scope.txtuserid === null || $scope.txtuserid === undefined || $scope.txtuserid === "") {
            GetAlert("* Please enter distributor code/ LAPU No.", "error");
        }
        else {
            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    userid: $scope.txtuserid,
                    OTP_type: 'Login'
                };
                $http({
                    method: 'POST',
                    url: 'IndependenceDayService.asmx/GenerateOTP',
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
                                $scope._IsOTPSent = true;
                            }
                            else { GetAlert(details.Message, 'error'); }
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

    };

    $scope.Login = function () {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                userid: $scope.txtuserid,
                OTP: $scope.loginform.txtOTP.$modelValue,
                OTP_type: 'Login'
            };
            $http({
                method: 'POST',
                url: 'IndependenceDayService.asmx/VerifyOTP',
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
                            $window.location.href = '#!/home';
                        }
                        else { GetAlert(details.Message, 'error'); }
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
});