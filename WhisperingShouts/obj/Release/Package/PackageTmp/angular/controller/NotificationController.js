var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('NotificationController', function ($scope, $http, $timeout, $filter, $window, $rootScope, $location
    , LoginService) {

    LoginService.CheckSession();

    //GetNotification();

    function GetNotification() {
        //console.log("AA");
        try {
            //ajaxindicatorstart('please wait..');
            //$('<audio id="chatAudio"><source src="sounds.mp3" type="audio/ogg"></audio>').appendTo('body');
            var _obj = {
                id: 0,
                content: "",
                read: false,
                notifiable_type: "user",
                request_type: "GET"
            };

            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetNotification',
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

    $scope.ReadNotification = function (id) {
        $scope.$broadcast('ReadNotification', { id: id });
    };

    function callAtTimeout() {
        GetNotification();
    }

    //$scope.ReadNotification = function (id) {
    //    try {

    //        var _obj = {
    //            id: id,
    //            content: "",
    //            read: true,
    //            notifiable_type: "user",
    //            request_type: "READ"
    //        };

    //        $http({
    //            method: 'POST',
    //            url: 'WhisperingShoutsService.asmx/ReadNotification',
    //            data: JSON.stringify(_obj),
    //            dataType: "json",
    //            contentType: "application/json"
    //        }).
    //            then(function (data) {
    //                GetNotification();
    //            }),
    //            error(function (ex) {
    //                GetAlert("Slow network detected, please try again!", "error");
    //            });
    //    }
    //    catch (ex) {
    //        //ajaxindicatorstop();
    //    }
    //};

   
});