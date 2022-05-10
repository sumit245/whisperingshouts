var MyApp = angular.module('WhisperingShoutsAppAdmin', []);

MyApp.controller('PartnersController', ['$scope', '$http', '$window', '$location', 'LoginService'
    , function ($scope, $http, $window, $location, LoginService) {

        LoginService.CheckSession();
        $scope._IsEdit = false;

        //var path = $location.$$path.split("/");
        //$scope.partner_id = path[path.length - 1];

        $scope.partner_id = GetParameterValues('id');
        console.log($scope.partner_id);
        if ($scope.partner_id === undefined || $scope.partner_id === null) {
            $scope._IsEdit = false;
            GetPartners(0);
        }
        else {
            $scope._IsEdit = true;
            GetPartners($scope.partner_id);
        }

        function GetPartners(id) {
            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    type: "GET",
                    id: id
                };
                $http({
                    method: 'POST',
                    url: '/WhisperingShoutsService.asmx/GetUpdatePartner',
                    data: JSON.stringify(_obj),
                    dataType: "json",
                    contentType: "application/json"
                }).
                    then(function (data) {
                        var _data = $.parseJSON(data.data.d);
                        ajaxindicatorstop();
                        if (_data !== null && _data.length > 0) {
                            var details = _data;
                            $scope.partnerList = details;

                            if (id != 0) {
                                $scope.description = _data[0].description;
                                //$("#ContentPlaceHolder1_description").val($scope.description);
                            }
                            if (id == 0) {
                                setTimeout(function () {
                                    $('#dtpartners').DataTable({
                                        bDestroy: true,
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

        $scope.ActiveDeactive = function (status, id) {
            try {
                ajaxindicatorstart('please wait..');
                var _obj = {
                    type: "ACTIVE_DEACTIVE",
                    status: status,
                    id: id
                };
                $http({
                    method: 'POST',
                    url: '/WhisperingShoutsService.asmx/GetUpdateUsersData',
                    data: JSON.stringify(_obj),
                    dataType: "json",
                    contentType: "application/json"
                }).
                    then(function (data) {
                        var _data = $.parseJSON(data.data.d);
                        ajaxindicatorstop();
                        if (_data !== null && _data.length > 0) {
                            var details = _data[0];
                            GetAlert(details.ResponseMSG, details.ResponseType, 'users.html');
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

        $scope.Redirect = function (partner_id) {
            window.location.href = 'partners.aspx?id=' + partner_id;
        };

        function GetParameterValues(param) {
            var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < url.length; i++) {
                var urlparam = url[i].split('=');
                if (urlparam[0] == param) {
                    return urlparam[1];
                }
            }
        }

    }]);