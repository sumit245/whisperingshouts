var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('IdentitiesController', function ($scope, $http, $window, $location, LoginService) {

    LoginService.CheckSession();

    GetIdentities();

    function GetIdentities() {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                type: "GET",
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
                        $scope.PartnerUserNameList = details;

                        setTimeout(function () {
                            $('#dtpartnerusername').DataTable({
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

    $scope.ApproveReject = function (approve, remarks, id) {

        if (approve === undefined) {
            GetAlert("Please select approve", "error");
        }
        else {

            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    type: "UPDATE",
                    status: approve,
                    remarks: remarks === undefined ? "" : remarks,
                    id: id
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
                            var details = _data[0];
                            GetAlert(details.ResponseMSG, details.ResponseType, '/identities', 1);
                            //GetAlert(details.ResponseMSG, details.ResponseType);
                            // GetIdentities();
                            //$window.location.href = '/identities';
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
    };

});