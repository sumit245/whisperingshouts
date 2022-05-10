var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('LogoutController', function ($scope, $http, $filter, $window, $rootScope, $location, LoginService) {
    Logout();

    function Logout() {
        sessionStorage.clear();
        localStorage.clear();

        $http({
            method: 'POST',
            url: 'WhisperingShoutsService.asmx/Logout',
            data: null,
            dataType: "json",
            contentType: "application/json"
        }).
            then(function (data) {
                if (data.data.d === "success") {
                    $window.location.href = '/poker';
                }
            });
    }

});