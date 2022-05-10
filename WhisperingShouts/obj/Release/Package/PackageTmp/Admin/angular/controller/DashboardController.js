var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('DashboardController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    LoginService.CheckSession();

    var CurrentPage = $location.path();

    GetAdminDashboardData();


    function GetAdminDashboardData() {
        try {
            ajaxindicatorstart('please wait..');
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetAdminDashboardData',
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
                        $scope.NewPlayersAddedThismonth = details.NewPlayersAddedThismonth;         
                        $scope.TotalPlayers = details.TotalPlayers;         
                        $scope.ActivePlayers = details.ActivePlayers;         
                        $scope.InactivePlayers = details.InactivePlayers;         
                        $scope.TotalLockedCommissionInUserAccounts = details.TotalLockedCommissionInUserAccounts;  
                        $scope.TotalWithdrawableCommissionsInUserAccounts = details.TotalWithdrawableCommissionsInUserAccounts;
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