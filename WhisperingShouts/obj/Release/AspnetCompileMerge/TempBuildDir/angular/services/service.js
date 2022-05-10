var MyApp = angular.module('WhisperingShoutsApp');

MyApp.service('LoginService', function ($http, $window) {

    this.CheckSession = function () {
        try {

            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/CheckSession',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    if (data.data.d === "fail") {
                        $window.location.href = '/login';
                    }
                    else if (data.data.d === "success") {
                        //$window.location.href = '/home';
                    }
                }),
                error(function (ex) {
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    };
});


MyApp.service('UserService', function ($http, $window) {

    this.IsUserRegistered = function () {
        try {
            //ajaxindicatorstart('please wait..');
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/IsUserRegistered',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    //ajaxindicatorstop();
                    if (data.data.d === "fail") {
                        $window.location.href = '/registration';
                    }                    
                }),
                error(function (ex) {
                    //ajaxindicatorstop();
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    };
});
