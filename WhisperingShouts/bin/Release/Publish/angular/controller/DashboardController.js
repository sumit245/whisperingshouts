var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('DashboardController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    var portal1 = 'Poker';
    var portal2 = 'Rummy';
    var pokerColor = '#2ECDF3';
    var rummyColor = '#BB001B';
    var pokerLogo = 'logo.png';
    var rummyLogo = 'rummy-logo.png';

    $scope.portalColor = pokerColor;
    $scope.portalLogo = pokerLogo;

    var _portal = localStorage.getItem("portal");
    _portal = _portal == portal1 ? portal2 : _portal == portal2 ? portal1 : 'Rummy';
    $scope.Portal = _portal; //!= undefined ? _portal : portal2;
    //localStorage.setItem("portal", "poker");
    if (_portal.toLowerCase() == 'rummy') {
        $scope.portalColor = pokerColor;
        $scope.portalLogo = pokerLogo;
    }

    else if (_portal.toLowerCase() == 'poker') {
        $scope.portalColor = rummyColor;
        $scope.portalLogo = rummyLogo;
    }

    LoginService.CheckSession();

    $scope.contestactiveclass = "";

    var CurrentPage = $location.path();
    $scope.firstgame = true;
    $scope.ContestWinnerCongratulationText = "";

    GetAllPartners(0);
    GetDashboardData();

    if (CurrentPage === "/passbook") {
        GetPassbook();
        GetTransactionData();
    }
    if (CurrentPage === "/withdraw") {
        GetPassbook();
    }
    if (CurrentPage === "/refer") {
        GetReferAFriendData();
    }
    if (CurrentPage === "/partner") {
        GetPartnerUserName();
    }
    if (CurrentPage === "/leaderboard") {
        $scope.leaderboardactiveclass = "nav-select";
        GetLeaderboard(0);
    }
    if (CurrentPage === "/contest-result") {
        //GetContestResult(2);
        GetAllContest(0);
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
                window.open('https://www.pokerdangal.com/my-account?campaigncode=whisp', "_newtab");
            });
        }
        else if ($scope.ClickedParterID == 16) {
            swal("Remember to use code WHISP");
            $(".confirm").click(function () {
                if ($scope.ClickedParterID == 16)
                    $scope.ClickMap("rummybaazi");
                window.open('https://www.rummybaazi.com/?campaigncode=WHISP', "_newtab");
            });
        }
        else if ($scope.ClickedParterID == 17) {
            swal("Remember to use code 9WHISP");
            $(".confirm").click(function () {
                if ($scope.ClickedParterID == 17)
                    $scope.ClickMap("9Stacks");
                window.open('https://bit.ly/34wRbF1', "_newtab");
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

    $scope.GetContestResult = function (contest_id) {
        $scope.ContestResultList = null;
		$scope.ContestWinnerCongratulationText = "";
        GetContestResult(contest_id);
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
                        if (_data[0].IsContestQuizTaken === 1) {
                            $scope.ContestResultList = _data;
                            $scope.ContestWinnerCongratulationText = _data[0].ContestWinnerCongratulationText;
                        }
                        else {
                            $window.location.href = '/contests';
                        }

                    }
					else {
                            $window.location.href = '/contests';
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

    function GetAllContest(contest_id) {
        try {
            //ajaxindicatorstart('please wait..');
            var _obj = {
                id: contest_id,
                request_type: "GET"
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetContests',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    //ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.ContestsList = _data;
                    }
                }),
                error(function (ex) {
                    //ajaxindicatorstop();
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }


    function GetReferAFriendData() {
        try {
            ajaxindicatorstart('please wait..');
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetReferAFriendData',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.ReferAFriendList = _data;
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