var MyApp = angular.module('WhisperingShoutsApp');


MyApp.controller('MetaController', ['$scope', function ($scope) {

    

    $scope.$on('$routeChangeSuccess', function (event, data) {

        $scope.page_title = "";
        $("#page_title").val("");
        $scope.page_description = "";
        $scope.page_keywords = "";

        $scope.page_title = data.title;
        $("#page_title").val(data.title);
        $scope.page_description = data.description;
        $scope.page_keywords = data.keywords;
    });

}]);