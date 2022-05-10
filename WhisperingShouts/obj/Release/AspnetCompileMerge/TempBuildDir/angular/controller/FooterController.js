var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('FooterController', function ($scope, $http, $timeout, $filter, $window, $rootScope, $location) {

    $scope.Subscribe = function () {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                email_id: $scope.emailid
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/Subscribe',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];    
                        GetAlert(details.ResponseMSG, details.ResponseType);
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