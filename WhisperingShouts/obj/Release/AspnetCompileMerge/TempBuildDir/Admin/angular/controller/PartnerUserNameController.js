var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('PartnerUserNameController', function ($scope, $http, $window, $location, LoginService) {

    LoginService.CheckSession();

    GetUpdatePartnerUserNameData();

    function GetUpdatePartnerUserNameData() {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                type: "GET",
                status: "",
                id: 0
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetUpdatePartnerUserNameData',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data;
                        $scope.PartnerUserNameList = details;

                        setTimeout(function () {
                            $('#dtpartnerusername').DataTable({
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
                url: '/WhisperingShoutsService.asmx/GetUpdatePartnerUserNameData',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];

                        GetAlert(details.ResponseMSG, details.ResponseType, 'partner-username.html');
                        //window.location.reload();

                        //GetUpdatePartnerUserNameData();

                        //var details = _data;
                        //$scope.PartnerUserNameList = details;      
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