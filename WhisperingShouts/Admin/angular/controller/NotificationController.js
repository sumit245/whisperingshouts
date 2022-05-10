var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('NotificationController', function ($scope, $http, $timeout, $filter, $window, $rootScope, $location
    , LoginService) {

    LoginService.CheckSession();

    GetAdminNotification();

    function GetAdminNotification() {
        //console.log("AA");
        try {
            //ajaxindicatorstart('please wait..');
            //$('<audio id="chatAudio"><source src="sounds.mp3" type="audio/ogg"></audio>').appendTo('body');
            var _obj = {
                id: 0,
                content: "",
                read: false,
                notifiable_type: "admin",
                request_type: "GET"
            };

            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetNotification',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    $timeout(callAtTimeout, 30 * 1000);
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.notificationList = _data;
                        $scope.notificationCount = _data[0].notification_count;
                        ReadAllNotification();
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
    }

    //$scope.ReadNotification = function (id) {
        
    //};

    function ReadAllNotification() {
        try {

            var _obj = {
                id: -1,
                content: "",
                read: true,
                notifiable_type: "admin",
                request_type: "READ"
            };

            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/ReadNotification',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    GetAdminNotification();
                    $rootScope.notificationCount = 0;
                    $("#notificationcount").html(0);
                }),
                error(function (ex) {
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }

    function callAtTimeout() {
        //console.log("Timeout occurred");
        GetAdminNotification();
    }
});