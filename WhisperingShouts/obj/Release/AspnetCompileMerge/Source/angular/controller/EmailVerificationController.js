var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('EmailVerificationController', function ($scope, $http, $window, $rootScope, $location) {
   
    $scope.VerifyEmail = function () {
        $("#divSuccess").hide();
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                emailid: '',
                token: $scope.emailVerificationToken
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/VerifyEmail',
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
                            $("#divSuccess").show();
                            GetAlert(details.ResponseMSG, details.ResponseType);
                        }
                        else {
                            GetAlert(details.ResponseMSG, details.ResponseType, "/login");
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
    }

    var path = $location.$$path.split("/");
    $scope.emailVerificationToken = path[path.length - 1];

    if ($scope.emailVerificationToken == undefined) {
        GetAlert("Invalid Token");
        return;
    }
    else {
        $scope.VerifyEmail();
    }
});