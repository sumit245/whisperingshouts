var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('LeaderboardController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {
   
    LoginService.CheckSession();

    $scope.weeklyleaderboard = true;
    $scope._IsEdit = false;

    var path = $location.$$path.split("/");
    $scope.leaderboard_id = path[path.length - 1];

    if ($scope.leaderboard_id === undefined || $scope.leaderboard_id === null || $scope.leaderboard_id === "leaderboard") {
        $scope._IsEdit = false;
        GetLeaderboard(0);
    }
    else {        
        $scope._IsEdit = true;
        GetLeaderboard($scope.leaderboard_id);
        //var item = $scope.leaderboardList.filter(x => x.id == $scope.leaderboard_id);
        //if (item != null && item.length > 0) {
        //    $scope.FilteredleaderboardList = item;
        //}
    }    

    function GetLeaderboard(id) {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                id: id,
                rank:0,
                type: "",
                request_type: "GET"               
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetLeaderboard',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data;
                        $scope.leaderboardList = _data;
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