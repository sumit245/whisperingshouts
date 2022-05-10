var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('ContactUsController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    $scope.SubmitContactUs = function () {
        var name = $scope.name;
        var email = $scope.email;
        var subject = $scope.subject;
        var message = $scope.message;
        var mobile = $scope.mobile;


        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                name: name,
                email: email,
                subject: subject,
                message: message,
                mobile: mobile
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/ContactUs',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        GetAlert(details.ResponseMSG, details.ResponseType, "/contact-us");
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