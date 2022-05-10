var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('UsersController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    LoginService.CheckSession();

    GetAllUsers();

    function GetAllUsers() {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                type: "GET_ALL",
                status: "",
                remarks: "",
                id: 0
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetUpdateIdentities',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data;
                        $scope.UsersList = details;

                        setTimeout(function () {
                            $('#dtusers').DataTable({
                                bDestroy: true,
                                "order": [[0, "desc"]],
                                "pagingType": "full_numbers",
                                "lengthMenu": [
                                    [10, 25, 50, -1],
                                    [10, 25, 50, "All"]
                                ],
                                responsive: false,
                                language: {
                                    search: "_INPUT_",
                                    searchPlaceholder: "Search records"
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

    //$scope.ActiveDeactive = function (status, id) {
    //    try {
    //        ajaxindicatorstart('please wait..');
    //        var _obj = {
    //            type: "ACTIVE_DEACTIVE",
    //            status: status,
    //            id: id
    //        };
    //        $http({
    //            method: 'POST',
    //            url: '/WhisperingShoutsService.asmx/GetUpdateUsersData',
    //            data: JSON.stringify(_obj),
    //            dataType: "json",
    //            contentType: "application/json"
    //        }).
    //            then(function (data) {
    //                var _data = $.parseJSON(data.data.d);
    //                ajaxindicatorstop();
    //                if (_data !== null && _data.length > 0) {
    //                    var details = _data[0];
    //                    GetAlert(details.ResponseMSG, details.ResponseType, 'users.html');
    //                }
    //            }),
    //            error(function (ex) {
    //                ajaxindicatorstop();
    //                GetAlert("Slow network detected, please try again!", "error");
    //            });
    //    }
    //    catch (ex) {
    //        //ajaxindicatorstop();
    //    }
    //};

});