var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('RewardsController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    LoginService.CheckSession();

    var CurrentPage = $location.path();
    CheckUserLoggedIn();
    $scope.TotalPercentComplete = 0;
    GetRewardsData();

    GetDashboardData();

    function GetDashboardData() {
        try {
            ajaxindicatorstart('please wait..');
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetDashboardData',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        $scope.DashboardData = details;
                        $scope.UserName = details.name;
                        $scope.AvailablePoints = '₹' + details.AvailablePoints;
                        $scope.ReferalCode = details.referral_code;

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

    function CheckUserLoggedIn() {
        try {

            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/CheckSession',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    if (data.data.d === "fail") {
                        $scope._IsUserLoggedIn = false;
                    }
                    else if (data.data.d === "success") {
                        $scope._IsUserLoggedIn = true;
                    }
                }),
                error(function (ex) {
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }

    function GetRewardsData() {
        try {
            ajaxindicatorstart('please wait..');
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetRewardsData',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        $scope.RewardsList = _data;

                        $scope.DashboardData = details;
                        $scope.UserName = details.name;
                        $scope.AvailablePoints = details.AvailablePoints;

                        //$scope.AvailablePoints = 0;

                        $scope.TotalDiamond = details.TotalDiamond;
                        $scope.TotalPointsForNextLevel = details.TotalPointsForNextLevel;
                        $scope.CurrentLevel = details.CurrentLevel;
                        $scope.PointsRequiredToNextLevel = $scope.TotalPointsForNextLevel - $scope.AvailablePoints;

                        var TotalPercentComplete = Math.round(parseFloat(parseInt($scope.AvailablePoints, 10) * 100) / parseInt($scope.TotalPointsForNextLevel, 10));
                        $scope.TotalPercentComplete = TotalPercentComplete;
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
});