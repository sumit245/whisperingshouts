var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('LogoutController', ['$scope', '$http', '$window', '$location'
    , function ($scope, $http, $window, $location) {

        Logout();

        function Logout() {
            sessionStorage.clear();
            localStorage.clear();

            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/Logout',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    if (data.data.d === "success") {
                        $window.location.href = '/login';
                    }
                });
        }

    }]);