var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('HomeController', function ($scope, $http, $filter, $window, $rootScope, $location
    , LoginService) {

    //LoginService.CheckSession();  

    $scope.bannerIndex = 0;
    $scope.setBannerIndex = function (bannerIndex) {
        $scope.bannerIndex = bannerIndex;
    }
    var portal1 = 'poker';
    var portal2 = 'rummy';
    var pokerColor = '#2ECDF3';
    var rummyColor = '#BB001B';
    var pokerLogo = 'logo.png';
    var rummyLogo = 'rummy-logo.png';

    var pokerURL = '/poker';
    var rummyURL = '/rummy';

    var pokerWhispIcon = 'whisp-logo-color.png';
    var rummyWhispIcon = 'whisp-rummy-icon.png';

    $scope.rakebackFAQ = true;
    $scope.RakebackQuestionTab = true;

    GetAllPartners(0);
    GetHomePageData();
    GetLeaderboard(0);

    function GetHomePageData() {
        try {
            //ajaxindicatorstart('please wait..');

            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetHomePageData',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    //ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.Registereduser = _data[0].Registereduser;
                        $scope.RealCashBonusGiven = _data[0].RealCashBonusGiven;
                        $scope.RakebackGiven = _data[0].RakebackGiven;
                        $scope.TournamentTicketsGiven = _data[0].TournamentTicketsGiven;

                        $("#spnRegistereduser").html("<div class=\"single-statics no-border\">" +
                            "                            <div class=\"icon-box\">" +
                            "                                <i class=\"ren-reguser\"></i>" +
                            "                            </div>" +
                            "                            <div class=\"text-box\">" +
                            "                                <span class=\"counter\">" + _data[0].Registereduser + "</span>" +
                            "                                <h4>Registered users</h4>" +
                            "                            </div>" +
                            "                        </div>");

                        $("#spnRealCashBonusGiven").html("<div class=\"single-statics\">" +
                            "                            <div class=\"icon-box\">" +
                            "                                <i class=\"ren-web\"></i>" +
                            "                            </div>" +
                            "                            <div class=\"text-box\">" +
                            "                                <span class=\"counter\">" + _data[0].RealCashBonusGiven + "</span>" +
                            "                                <h4>Real cash bonus given</h4>" +
                            "                            </div>" +
                            "                        </div>");

                        $("#spnRakebackGiven").html("<div class=\"single-statics\">" +
                            "                            <div class=\"icon-box\">" +
                            "                                <i class=\"ren-withdraw\"></i>" +
                            "                            </div>" +
                            "                            <div class=\"text-box\">" +
                            "                                <span class=\"counter\">" + _data[0].RakebackGiven + "</span>" +
                            "                                <h4>Rakeback given</h4>" +
                            "                            </div>" +
                            "                        </div>");

                        $("#spnTournamentTicketsGiven").html("<div class=\"single-statics\">" +
                            "                            <div class=\"icon-box\">" +
                            "                                <i class=\"ren-people\"></i>" +
                            "                            </div>" +
                            "                            <div class=\"text-box\">" +
                            "                                <span class=\"counter\">" + _data[0].TournamentTicketsGiven + "</span>" +
                            "                                <h4>Tournament tickets given</h4>" +
                            "                            </div>" +
                            "                        </div>");

                        //$("#spnstaticcontent").html("<div class=\"col-lg-3 col-md-6 col-sm-6 text-center\">" +
                        //    "                        <span id=\"spnRegistereduser\"></span>" +
                        //    "                        <div class=\"single-statics no-border\">" +
                        //    "                            <div class=\"icon-box\">" +
                        //    "                                <i class=\"ren-reguser\"></i>" +
                        //    "                            </div>" +
                        //    "                            <div class=\"text-box\">" +
                        //    "                                <span class=\"counter\">" + _data[0].Registereduser+"</span>" +
                        //    "                                <h4>Registered users</h4>" +
                        //    "                            </div>" +
                        //    "                        </div>" +
                        //    "                    </div>" +
                        //    "                    <div class=\"col-lg-3 col-md-6 col-sm-6 text-center\">" +
                        //    "                        <div class=\"single-statics\">" +
                        //    "                            <div class=\"icon-box\">" +
                        //    "                                <i class=\"ren-web\"></i>" +
                        //    "                            </div>" +
                        //    "                            <div class=\"text-box\">" +
                        //    "                                <span class=\"counter\">" + _data[0].RealCashBonusGiven+"</span>" +
                        //    "                                <h4>Real cash bonus given</h4>" +
                        //    "                            </div>" +
                        //    "                        </div>" +
                        //    "                    </div>" +
                        //    "                    <div class=\"col-lg-3 col-md-6 col-sm-6 text-center\">" +
                        //    "                        <div class=\"single-statics\">" +
                        //    "                            <div class=\"icon-box\">" +
                        //    "                                <i class=\"ren-withdraw\"></i>" +
                        //    "                            </div>" +
                        //    "                            <div class=\"text-box\">" +
                        //    "                                <span class=\"counter\">" + _data[0].RakebackGiven+"</span>" +
                        //    "                                <h4>Rakeback given</h4>" +
                        //    "                            </div>" +
                        //    "                        </div>" +
                        //    "                    </div>" +
                        //    "                    <div class=\"col-lg-3 col-md-6 col-sm-6 text-center\">" +
                        //    "                        <div class=\"single-statics\">" +
                        //    "                            <div class=\"icon-box\">" +
                        //    "                                <i class=\"ren-people\"></i>" +
                        //    "                            </div>" +
                        //    "                            <div class=\"text-box\">" +
                        //    "                                <span class=\"counter\">" + _data[0].TournamentTicketsGiven+"</span>" +
                        //    "                                <h4>Tournament tickets given</h4>" +
                        //    "                            </div>" +
                        //    "                        </div>" +
                        //    "                    </div>");
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

    function GetLeaderboard(id) {
        try {
            //ajaxindicatorstart('please wait..');
            var _obj = {
                id: id,
                rank: 0,
                type: "",
                request_type: "GET"
            };
            $http({
                method: 'POST',
                //async: false,
                cache: false, // required
                url: '/WhisperingShoutsService.asmx/GetLeaderboard',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    //ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.leaderboardList = _data;
                        var _item = ''
                        for (var i = 0; i < _data.length; i++) {
                            //_item += '#' + _data[i].rank_detail + ': ' + _data[i].name + '<img src=' + _data[i].userImage + ' onerror="this.src=/assets/images/user-img.png" class="img-fluid-for-marquee"/> ; ';
                            _item += '#' + _data[i].rank_detail + ': ' + _data[i].name + ' ';
                        }
                        $rootScope.leaderboardUsers = _item;
                        //$("#leaderboardUsers").html(_item);
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
    $scope.setPortal_V1 = function (portal) {
        console.log(portal)
        var _portal = portal;
        if (_portal == 'rummy') {
            $scope.Portal = 'rummy';
            $rootScope.Portal = 'rummy';
            localStorage.setItem("portal", "rummy");
            $scope.portalColor = pokerColor;
        }
        else if (_portal == 'poker') {
            $scope.Portal = 'poker';
            $rootScope.Portal = 'poker';
            localStorage.setItem("portal", "poker");
            $scope.portalColor = rummyColor;
        }
    }

    $rootScope.getBanner = function () {
        //ajaxindicatorstart('please wait..');
        try {
            var _obj = {
                bannerId: 0
            }
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/getBanner',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    //ajaxindicatorstop();
                    var _data = $.parseJSON(data.data.d);
                    if (_data !== null) {
                        console.log('getBanner');
                        console.log(_data["Table"]);

                        $scope.BannerList = _data["Table"];
                    }
                }),
                error(function (ex) {
                    //ajaxindicatorstop();
                    //GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }

    $scope.rummySignUp = function (_form) {

        if (_form.$invalid) {
            GetAlert("Please complete form", "error");
            return;
        }
        
        try {
            var _obj = {
                name: $scope.rummyName,
                email: $scope.rummyEmail,
                mobile: $scope.rummyMobile
            }
            $http({
                method: 'POST',
                url: '/WhisperingShoutsService.asmx/rummySignUp',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json",
                async: false,
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data[0];
                        if (details.ResponseType == "success")
                            GetAlert(details.ResponseMSG, details.ResponseType);
                        else
                            GetAlert(details.ResponseMSG, details.ResponseType);
                    }
                }).catch(ajaxindicatorstop());
        }
        catch (ex) {
        }
    }

});

MyApp.controller('VersionCtrl', function ($scope) {
    $scope._version = Math.random();
});