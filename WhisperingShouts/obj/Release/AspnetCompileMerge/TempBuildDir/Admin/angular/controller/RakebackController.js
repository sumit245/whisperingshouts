var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('RakebackController', function ($scope, $http, $filter, $window, $rootScope, $location, LoginService) {

    LoginService.CheckSession();

    $scope.EditForm = false;

    $scope.CalculateAmount = function () {
        var cutoff = $scope.cutoff;
        Total = $scope.totalrakeback;
        calcAmount = ((Total / 100) * cutoff);
        $scope.payableamount = calcAmount.toFixed(2);
    };

    $scope.GetFilterData = function () {

        var identity = $scope.ddlidentity;

        $scope.personname = "";
        $scope.partnername = "";
        $scope.totalrakeback = "";
        $scope.cutoff = "";
        $scope.payableamount = 0;
        $scope.description = "";
        $scope.username = "";
        $scope.person_id = 0;

        var FilterData = $scope.RakebackStatsList.filter(x => x.username == identity);

        if (FilterData != null && FilterData.length > 0) {
            $scope.personname = FilterData[0].name;
            $scope.partnername = FilterData[0].partnername;
            $scope.username = FilterData[0].username;
            $scope.person_id = FilterData[0].person_id;
        }
    };

    GetRakebackStats();

    function GetRakebackStats() {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                person_id: 0,
                amount: 0,
                description: "",
                request_type: "GET"
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetUpdateRakebackStats',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data;

                        $scope.RakebackStatsList = details;

                        $scope.AllIdentity = [];

                        if (_data.length > 0) {
                            for (var i in _data) {
                                $scope.AllIdentity.push(_data[i].username);
                            }
                        }
                        var uniqueIdentity = $scope.AllIdentity.filter(onlyUnique);
                        $scope.AllIdentity = uniqueIdentity;

                        setTimeout(function () {
                            $('#dtrakebackstats').DataTable({
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

    $scope.AddRakebackStats = function () {

        var person_id = $scope.person_id;
        var amount = $scope.payableamount;
        var request_type = "ADD";

        var description = "Added rakeback of username '" + $scope.username + "' at '" + $scope.partnername + "'";

        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                person_id: person_id,
                amount: amount,
                description: description,
                request_type: request_type
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetUpdateRakebackStats',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        GetAlert(details.ResponseMSG, details.ResponseType, "/rakeback-stats");

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

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }
    $scope.uploadRakebackFile = function () {
        uploadRakebackFile();
    }
    function uploadRakebackFile() {

        var IsOk = 1;
        //alert($("#fldRakeback").val().length)
        if ($("#fldRakeback").val().length <= 0) {
            GetAlert('Please select file', 'error');
            return;
        }

        ajaxindicatorstart('please wait..');

        var fileUpload = $("#fldRakeback").get(0);
        var files = fileUpload.files;
        var test = new FormData();
        for (var i = 0; i < files.length; i++) {
            test.append(files[i].name, files[i]);
        }
        $.ajax({
            url: "FileHandler.ashx?type=Rakeback",
            type: "POST",
            contentType: false,
            processData: false,
            data: test,
            success: function (result) {
                ajaxindicatorstop();
                if (result.lastIndexOf('updated') < 0) {
                    GetAlert('Data uploading fail, please contact with system administrator', 'error');
                }
                else {
                    GetAlert(result, 'success');
                }
            },
            error: function (err) {
                IsOk = 0;
                ajaxindicatorstop();
                GetAlert(err.statusText, "error");
            }
        });
    }
});