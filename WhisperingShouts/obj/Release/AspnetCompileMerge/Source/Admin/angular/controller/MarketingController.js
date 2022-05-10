var MyApp = angular.module('WhisperingShoutsAppAdmin');

MyApp.controller('MarketingController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    LoginService.CheckSession();
    $scope._IsEdit = false;

    var path = $location.$$path.split("/");
    $scope.announcement_id = path[path.length - 1];

    if ($scope.announcement_id === undefined || $scope.announcement_id === null || $scope.announcement_id === "announcements") {
        $scope._IsEdit = false;
        GetAnnouncements(0);
    }
    else {
        //if (localStorage.getItem('isLoadedAnnouncements') !== 'yes') {
        //    localStorage.setItem('isLoadedAnnouncements', 'yes');
        //    location.reload();
        //}
        $scope._IsEdit = true;
        GetAnnouncements($scope.announcement_id);
    }

    //$scope.OpenForm = function () {
    //    alert('');
    //}

    function GetAnnouncements(announcement_id) {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                type: "GET",
                status: "",
                content: "",
                id: announcement_id
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetUpdateAnnouncements',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data;

                        if (announcement_id !== 0) {
                            localStorage.removeItem("isLoadedAnnouncements");
                            $scope.content = _data[0].content;
                            $scope.status = _data[0].active;
                            $scope.announcement_id = _data[0].id;
                        }

                        $scope.AnnouncementsList = details;
                        if (announcement_id === 0) {
                            setTimeout(function () {
                                $('#dtannouncements').DataTable({
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

    $scope.UpdateAnnouncements = function () {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                type: "UPDATE",
                status: true,
                content: $scope.content,
                id: $scope.announcement_id
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetUpdateAnnouncements',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        GetAlert(details.ResponseMSG, details.ResponseType, '/announcements');
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