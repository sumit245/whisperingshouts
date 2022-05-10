var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('MenuController', function ($scope, $http, $filter, $window, $rootScope, $location, $timeout) {

    $scope._IsUserLoggedIn = false;
    $scope._IsUserRegsitered = false;
    $scope.notificationCount = 0;

    if ($rootScope.notificationCount !== undefined) {
        $scope.notificationCount = $rootScope.notificationCount;
    }

    var CurrentPage = $location.path();

    GetAdminNotification();

    function GetAdminNotification() {
        try {
            $('<audio id="notification_audio"><source src="sounds.mp3" type="audio/ogg"></audio>').appendTo('body');

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
                    callAtTimeout();
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.notificationCount = _data[0].notification_count;
                        if (_data[0].IsNewNotification === 1) {
                            $("#notification_audio").get(0).play();
                        }
                    }
                    else {
                        $scope.notificationCount = 0;
                    }
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
        $timeout(GetAdminNotification, 60 * 1000);
    }
    
});