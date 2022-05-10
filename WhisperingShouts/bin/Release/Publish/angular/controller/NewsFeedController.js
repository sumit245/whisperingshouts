var MyApp = angular.module('WhisperingShoutsApp');


MyApp.controller('NewsFeedController', function ($scope, $http, $filter, $window, $rootScope, $location) {

    GetNewsFeed();
    $scope.newsFeed = "";

    

    function GetNewsFeed() {
        try {
            //ajaxindicatorstart('please wait..');

            $http({
                method: 'GET',
                url: 'https://dev132-cricket-live-scores-v1.p.rapidapi.com/matches.php?completedlimit=5&inprogresslimit=5&upcomingLimit=5',
                data: null,
                dataType: "json",
                contentType: "application/json",
                headers: {
                    "x-rapidapi-host": "dev132-cricket-live-scores-v1.p.rapidapi.com",
                    "x-rapidapi-key": "a295e76109msh7ef846b473c7edep125b0bjsnda035124e783"
                }
            }).
                then(function (data) {
                    console.log(data);
                }),
                error(function (ex) {
                    //ajaxindicatorstop();
                    GetAlert("Slow network detected, please try again!", "error");
                });

            $http({
                method: 'GET',
                url: 'https://newsapi.org/v2/top-headlines?country=in&category=sports&apiKey=9cb9c8538bc043c78d55a2ce42b78e0f',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = data.data.articles;
                    $scope.newsFeed = _data;
                    //console.log(_data);
                }),
                error(function (ex) {
                    //ajaxindicatorstop();
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //console.log(ex);
        }
    }

    $scope.imgError = function (image_file_name) {
        return "http://admin.whisperingshouts.com/images/blog/" + image_file_name;
    };
    //onerror="angular.element(this).scope().imgError({{blog.image_file_name}})"
    //onload="angular.element(this).scope().imgLoaded()" 

});