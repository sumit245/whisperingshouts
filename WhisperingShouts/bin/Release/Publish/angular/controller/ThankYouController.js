var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('ThankYouController', function ($scope, $http, $filter, $window, $rootScope, $location, LoginService) {
    LoginService.CheckSession();

    $scope.TotalScoreByUser = $rootScope.TotalScoreByUser;
    if ($scope.TotalScoreByUser > 0)
        $scope._IsOkForDisplayScore = 1;

    if ($scope.TotalScoreByUser !== undefined) {
        if ($scope.TotalScoreByUser > 1)
            $scope.TotalScoreByUser = $scope.TotalScoreByUser + " Flags!";
        else
            $scope.TotalScoreByUser = $scope.TotalScoreByUser + " Flag!";
    }

});