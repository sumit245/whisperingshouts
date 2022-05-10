var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('DashboardController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    LoginService.CheckSession();

    $scope.contestactiveclass = "";

    var CurrentPage = $location.path();
    $scope.firstgame = true;

    GetAllPartners(0);
    GetDashboardData();

    if (CurrentPage === "/passbook") {
        GetTransactionData();
    }
    if (CurrentPage === "/withdraw") {
        GetPassbook();
    }
    if (CurrentPage === "/referfriend") {
        GetTransactionData();
    }
    if (CurrentPage === "/partner-username") {
        GetPartnerUserName();
    }
    if (CurrentPage === "/leaderboard") {
        $scope.leaderboardactiveclass = "nav-select";
        GetLeaderboard(0);
    }
    if (CurrentPage === "/contest-result") {
        GetContestResult(2);
        $scope.contestactiveclass = "nav-select";
    }

    function GetDashboardData() {
        try {
            ajaxindicatorstart('please wait..');
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetDashboardData',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        $scope.DashboardData = details;
                        $scope.UserName = details.name;
                        $scope.AvailablePoints = '₹' + details.AvailablePoints;
                        $scope.ReferalCode = details.referral_code;

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

    function GetPassbook() {
        try {
            ajaxindicatorstart('please wait..');
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetPassbook',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.PassbookData = _data;
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

    function GetTransactionData() {
        try {
            ajaxindicatorstart('please wait..');
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetTransactionData',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.TransactionData = _data;
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

    $scope.WithdrawAmount = function () {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                points: $scope.amount
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/WithdrawAmount',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    $scope.amount = 0;
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        GetAlert(details.ResponseMSG, details.ResponseType);
                    }
                    GetDashboardData();
                    if (CurrentPage === "/passbook") {
                        GetTransactionData();
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

    $scope.AddPartnerUserName = function () {
        try {
            ajaxindicatorstart('please wait..');
            var ErrorMSG = "";
            if ($scope.ddlpartner === undefined) {
                ErrorMSG = ErrorMSG + "* Please select partner";
            }
            if ($scope.partnerusername === undefined) {
                ErrorMSG = ErrorMSG + "* Please enter user name";
            }
            if (ErrorMSG !== "") {
                ajaxindicatorstop();
                GetAlert(ErrorMSG, "error");
            }
            else {
                var _obj = {
                    PartnerID: $scope.ddlpartner,
                    UserName: $scope.partnerusername
                };
                $http({
                    method: 'POST',
                    url: 'WhisperingShoutsService.asmx/AddPartnerUserName',
                    data: JSON.stringify(_obj),
                    dataType: "json",
                    contentType: "application/json"
                }).
                    then(function (data) {
                        var _data = $.parseJSON(data.data.d);
                        ajaxindicatorstop();
                        if (_data !== null && _data.length > 0) {
                            var details = _data[0];
                            if (details.IsSuccess === 1) {
                                $scope.ddlpartner = "";
                                $scope.partnerusername = "";
                                GetPartnerUserName();
                                GetAlert(details.ResponseMSG, 'success');
                            }
                            else { GetAlert(details.ResponseMSG, 'error'); }
                        }
                    }),
                    error(function (ex) {
                        ajaxindicatorstop();
                        GetAlert("Slow network detected, please try again!", "error");
                    });
            }
        }
        catch (ex) {
            //ajaxindicatorstop();
        }

    };

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

    function GetPartnerUserName() {
        try {
            ajaxindicatorstart('please wait..');
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetPartnerUserName',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.PartnerUserNames = _data;
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


    function GetLeaderboard(id) {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                id: id,
                rank: 0,
                type: "",
                request_type: "GET"
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetLeaderboard',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data;
                        $scope.leaderboardList = _data;
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

    $scope.RedirectToPartnerPage = function (partner_id) {
        $scope.ClickedParterID = partner_id;

        if ($scope.ClickedParterID == 2) {
            swal("Remember to use code WHISP");
            $(".confirm").click(function () {
                if ($scope.ClickedParterID == 2)
                    $scope.ClickMap("pokerbaazi");
                window.open('https://pokerbaazi.com/', "_newtab");
            });
        }
        else if ($scope.ClickedParterID == 4) {
            swal("Remember to use code WHISP");
            $(".confirm").click(function () {
                if ($scope.ClickedParterID == 4)
                    $scope.ClickMap("pokerdangal");
                window.open('https://www.pokerdangal.com/', "_newtab");
            });
        }        
    };

    $scope.ClickMap = function (name) {
        try {

            var _obj = {
                name: name
            };

            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/ClickMap',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    //var _data = $.parseJSON(data.data.d);
                }),
                error(function (ex) {
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    };

    function GetContestResult(contest_id) {
        try {
            ajaxindicatorstart('please wait..');
            var _obj = {
                contest_id: contest_id
            };
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/GetContestResult',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {                        
                        $scope.ContestResultList = _data;
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