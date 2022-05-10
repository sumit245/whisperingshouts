var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('PassbookController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    LoginService.CheckSession();
});