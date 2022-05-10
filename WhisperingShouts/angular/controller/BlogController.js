var MyApp = angular.module('WhisperingShoutsApp');


MyApp.controller('BlogController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    //LoginService.CheckSession();  
    $scope.allblog = true;

    var path = $location.$$path.split("/");
    $scope.BlogSlug = path[path.length - 1];

    if ($scope.BlogSlug === undefined || $scope.BlogSlug === null || $scope.BlogSlug === "blog") {
        GetBlog(0);
    }
    else if ($scope.BlogSlug.indexOf("-") > 0) {
        var blog_id = $scope.BlogSlug.split("-");
        $scope.blog_id = blog_id[blog_id.length - 1];

        if ($scope.blog_id !== undefined && $scope.blog_id !== null && $scope.blog_id !== "") {
            GetBlog($scope.blog_id);
        }
    }


    function GetBlog(id) {
        try {
            //ajaxindicatorstart('please wait..');
            var _obj = {
                id: id,
                request_type: "GET"
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetBlog',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    //console.log($.parseJSON(data.data.d))
                    var _data = $.parseJSON(data.data.d);
                    //ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        if (id == 0)
                            $scope.blogList = _data;
                        else {
                            $scope.BlogDescription = _data[0].description;
                            $scope.image_file_name = _data[0].image_file_name;
                            $scope.title = _data[0].title;
                            $("#BlogDescription").html(_data[0].description);
                        }
                    }
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

    $scope.imgError = function (image_file_name) {
        return "http://admin.whisperingshouts.com/images/blog/" + image_file_name;
    };
    //onerror="angular.element(this).scope().imgError({{blog.image_file_name}})"
    //onload="angular.element(this).scope().imgLoaded()" 

});