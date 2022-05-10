var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('CommonController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    LoginService.CheckSession();
});