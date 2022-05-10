var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('WithdrawRequestController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

        LoginService.CheckSession();

        GetUpdateWithdrawRequestData();

        function GetUpdateWithdrawRequestData() {
            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    type: "GET",
                    status: "",
                    id: 0
                };
                $http({
                    method: 'POST',
                    url: '/WhisperingShoutsService.asmx/GetUpdateWithdrawRequestData',
                    data: JSON.stringify(_obj),
                    dataType: "json",
                    contentType: "application/json"
                }).
                    then(function (data) {
                        var _data = $.parseJSON(data.data.d);
                        ajaxindicatorstop();
                        if (_data !== null && _data.length > 0) {
                            var details = _data;
                            $scope.WithdrawRequestControllerList = details;

                            setTimeout(function () {
                                $('#dtwithdrawrequest').DataTable({
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

        $scope.ApproveReject = function (status, id) {
            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    type: "UPDATE",
                    status: status,
                    id: id
                };
                $http({
                    method: 'POST',
                    url: '/WhisperingShoutsService.asmx/GetUpdateWithdrawRequestData',
                    data: JSON.stringify(_obj),
                    dataType: "json",
                    contentType: "application/json"
                }).
                    then(function (data) {
                        var _data = $.parseJSON(data.data.d);
                        ajaxindicatorstop();
                        if (_data !== null && _data.length > 0) {
                            var details = _data[0];                            
                            GetUpdateWithdrawRequestData();
                            GetAlert(details.ResponseMSG, details.ResponseType, '/withdraw-request');
                            //blackDashboard.showSidebarMessage(details.ResponseMSG);
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
        };

    });