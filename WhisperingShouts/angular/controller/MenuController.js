var MyApp = angular.module('WhisperingShoutsApp');

MyApp.controller('MenuController', function ($scope, $http, $timeout, $filter, $window, $rootScope, $location) {


    var portal1 = 'Poker';
    var portal2 = 'Rummy';
    var pokerColor = '#2ECDF3';
    var rummyColor = '#BB001B';
    var pokerLogo = 'logo.png';
    var rummyLogo = 'rummy-logo.png';

    var pokerURL = '/poker';
    var rummyURL = '/rummy';

    var pokerWhispIcon = 'whisp-logo-color.png';
    var rummyWhispIcon = 'whisp-rummy-icon.png';

    //whisp-rummy-icon.png

    $scope.portalColor = pokerColor;
    $scope.portalLogo = pokerLogo;

    var _portal = "";

    //var _location = $location.$$path;
    //if (_location == '/poker') {
    //    _portal = 'poker';
    //    $scope.Portal = _portal;
    //    $scope.portalColor = pokerColor;
    //    $scope.portalLogo = pokerLogo;
    //    localStorage.setItem("portal", "poker");
    //}
    //else if (_location == '/rummy') {
    //    _portal = 'rummy';
    //    $scope.Portal = _portal;
    //    $scope.portalColor = pokerColor;
    //    $scope.portalLogo = pokerLogo;
    //    localStorage.setItem("portal", "rummy");
    //}

    _portal = localStorage.getItem("portal");
    _portal = _portal == portal1 ? portal2 : _portal == portal2 ? portal1 : 'Rummy';
    $scope.Portal = _portal; //!= undefined ? _portal : portal2;
    //localStorage.setItem("portal", "poker");



    if (_portal.toLowerCase() == 'rummy') {
        $scope.portalColor = pokerColor;
        $scope.portalLogo = pokerLogo;
        $scope.portalURL = pokerURL;
        $scope.portalWhispIcon = pokerWhispIcon;
        $rootScope.portalWhispIcon = pokerWhispIcon;
        $rootScope.portalType = 'Poker';
    }

    else if (_portal.toLowerCase() == 'poker') {
        $scope.portalColor = rummyColor;
        $scope.portalLogo = rummyLogo;
        $scope.portalURL = rummyURL;
        $scope.portalWhispIcon = rummyWhispIcon;
        $rootScope.portalWhispIcon = rummyWhispIcon;
        $rootScope.portalType = 'Rummy';
    }


    $rootScope.setPortal = function (_redirect) {
        var _portal = $scope.Portal;//localStorage.getItem("portal");
        if (_portal.toLowerCase() == 'rummy') {
            $scope.Portal = 'Rummy';
            $rootScope.Portal = 'Rummy';
            localStorage.setItem("portal", "Rummy");
            $scope.portalColor = pokerColor;
        }
        else if (_portal.toLowerCase() == 'poker') {
            $scope.Portal = 'Poker';
            $rootScope.Portal = 'Poker';
            localStorage.setItem("portal", "Poker");
            $scope.portalColor = rummyColor;
        }
        if (_redirect !== undefined) {
            window.location.href =_redirect;
        }
        else {
            window.location.reload();
        }
    }

    $scope._IsUserLoggedIn = false;
    $scope._IsUserRegsitered = false;
    //$scope.ShowHeader = true;
    var CurrentPage = $location.path();
    CheckUserLoggedIn();

    $scope.CurrentPage = CurrentPage.slice(1).replace("-", " ");
    if ($scope.CurrentPage === "referfriend") {
        $scope.CurrentPage = "Refer A Friend";
    }

    $scope.announcements = "";

    GetAnnouncements(0);

    if (CurrentPage !== "/login") {
        GetNotification();
        $scope._IsUserLoggedIn = true;
    }

    function GetNotification() {
        //console.log("AA");
        try {
            //ajaxindicatorstart('please wait..');
            //$('<audio id="chatAudio"><source src="sounds.mp3" type="audio/ogg"></audio>').appendTo('body');
            var _obj = {
                id: 0,
                content: "",
                read: false,
                notifiable_type: "user",
                request_type: "GET"
            };

            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/GetNotification',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    $timeout(callAtTimeout, 30 * 1000);
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        $scope.notificationList = _data;
                        $scope.notificationCount = _data[0].notification_count;

                        $rootScope.notificationList = _data;
                        $rootScope.notificationCount = _data[0].notification_count;
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

    function callAtTimeout() {
        //console.log("Timeout occurred");
        //GetNotification();
        $timeout(GetNotification, 30 * 1000);
    }

    $scope.$on('ReadNotification', function (event, args) {
        ReadNotification(args.id);
    });


    function ReadNotification(id) {
        try {
            var _obj = {
                id: id,
                content: "",
                read: true,
                notifiable_type: "user",
                request_type: "READ"
            };
            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/ReadNotification',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    GetNotification();
                }),
                error(function (ex) {
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }


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
                url: 'WhisperingShoutsService.asmx/GetUpdateAnnouncements',
                data: JSON.stringify(_obj),
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    var _data = $.parseJSON(data.data.d);
                    ajaxindicatorstop();
                    if (_data !== null && _data.length > 0) {
                        var details = _data;
                        if (announcement_id === 0) {
                            $scope.announcements = _data[0].content;
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


    //if (CurrentPage === "/login") {
    //    $scope._IsUserLoggedIn = false;
    //}
    ////else if (CurrentPage === "/home") {
    ////    $scope._IsUserLoggedIn = false;
    ////}
    //else if (CurrentPage === "/registration") {
    //    $scope._IsUserLoggedIn = false;
    //}
    //else {
    //    $scope._IsUserLoggedIn = true;
    //}

    $scope.ShowDiv = function () {
        var isVisible = $('#navbarResponsive').is(':visible');

        if (isVisible == "true" || isVisible == true) {
            $("#navbarResponsive").hide();
        }
        else {
            $("#navbarResponsive").show();
        }
    };
    $scope.HideDiv = function () {
        $("#navbarResponsive").hide();
    };

    switch (CurrentPage) {
        case "/poker":
            $scope.homeclass = "menu-active";
            break;
        case "/login":
            $scope.loginregistrationclass = "menu-active";
            break;
        case "/registration":
            $scope.loginregistrationclass = "menu-active";
            break;
        case "/dashboard":
            $scope.dashboardclass = "menu-active";
            break;
        case "/contact-us":
            $scope.contactusclass = "active";
            break;
    }

    function CheckUserLoggedIn() {
        try {

            $http({
                method: 'POST',
                url: 'WhisperingShoutsService.asmx/CheckSession',
                data: null,
                dataType: "json",
                contentType: "application/json"
            }).
                then(function (data) {
                    if (data.data.d === "fail") {
                        $scope._IsUserLoggedIn = false;
                    }
                    else if (data.data.d === "success") {
                        $scope._IsUserLoggedIn = true;
                    }
                }),
                error(function (ex) {
                    GetAlert("Slow network detected, please try again!", "error");
                });
        }
        catch (ex) {
            //ajaxindicatorstop();
        }
    }

    
});