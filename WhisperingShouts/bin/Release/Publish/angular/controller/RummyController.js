var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('RummyController', function ($scope, $http, $filter, $window, $rootScope, $location) {

    $scope.dealId = 0;
    $scope.getDealId = function () {
        var _url = $location.$$path;
        console.log(_url);
        var _dealId = _url.split('/')[2];
        console.log(_dealId)
        if (_dealId !== undefined) {
            $scope.dealId = _dealId;
        }
    }

});