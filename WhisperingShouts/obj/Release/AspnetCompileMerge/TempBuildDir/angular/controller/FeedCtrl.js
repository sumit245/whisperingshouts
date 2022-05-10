var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('FeedCtrl', function ($scope, $http) {
    $scope.DescriptionToShow = false;

    $scope.getRSSFeed = function () {
        try {
            var _obj = {
                //url: 'https://www.pokernews.com/rss.php?subset=q1ZKVLJS0lLSUSpRsjLQUSotBnKLiouVagE='
                url: 'https://www.pokerstrategy.com/rss/allnews/'
                //url:'http://www.pokershots.co/feed/'
                //url:'https://www.pokerstrategy.com/news/world-of-poker/Qing-Liu-wins-a-very-memorable-World-Poker-Tour_117170/'
            }
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetFeed',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    //console.log('Feed')
                    //console.log(_data)
                    $scope.FeedList = _data;

                    //$scope.getAnotherRSSFeed();
                }),
                error(function (ex) {
                    //ajaxindicatorstop();
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }

    $scope.getAnotherRSSFeed = function () {
        try {
            var _obj = {
                url: 'http://www.pokershots.co/feed/'
            }
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetFeed',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    $scope.FeedList = _data;
                }),
                error(function (ex) {
                    //ajaxindicatorstop();
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }
    $scope.ShowDescription = function (_Description) {
        $scope.DescriptionToShow = true;
        $scope.Description = _Description;
    }
});