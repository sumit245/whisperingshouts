var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('PassbookController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    LoginService.CheckSession();

    GetPassbook();

    function GetPassbook() {
        try {
            ajaxindicatorstart('please wait..');
            
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetPassbook',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        //var details = _data[0];
                        $scope.PassbooksList = _data;


                        setTimeout(function () {
                            $('#dtpassbooks').DataTable({
                                bDestroy: true,
                                "pagingType": "full_numbers",
                                "lengthMenu": [
                                    [10, 25, 50, -1],
                                    [10, 25, 50, "All"]
                                ],
                                responsive: false,
                                language: {
                                    search: "_INPUT_",
                                    searchPlaceholder: "Search records",
                                }

                            });
                        }, 1000);
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