var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('RakebackController', function ($scope, $http, $filter, $window, $rootScope, $location
    , $routeParams) {

    var path = $location.$$path.split("/");
    //var result = path[path.length - 1]; // Or parts.pop();
    //console.log(result);

    $scope.partner_id = path[path.length - 1];
    //console.log($scope.partner_id);
    if ($scope.partner_id === undefined || $scope.partner_id === null || $scope.partner_id === "rakeback") {
        GetAllPartners(0);
    }
    else {
        GetAllPartners($scope.partner_id);
    }
    function GetAllPartners(partner_id) {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                partner_id: partner_id
            };

            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetAllPartners',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.PartnerList = _data;
                        $scope.description = _data[0].description;

                        $("#description").html($scope.description);
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