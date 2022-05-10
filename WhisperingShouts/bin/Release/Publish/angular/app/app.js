var MyApp = angular.module('WhisperingShoutsApp', ['ngRoute','ngSanitize']);
MyApp.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/login', {
            controller: 'LoginController',
            templateUrl: 'views/login.html'
            //templateUrl: 'uc.html'
        })
        .when('/registration', {
            controller: 'RegistrationController',
            templateUrl: 'views/registration.html'
        })
        .when('/registration/:referralcode', {
            controller: 'RegistrationController',
            templateUrl: 'views/registration.html'
        })
        .when('/forgot-password', {
            controller: 'LoginController',
            templateUrl: 'views/forgot-password.html'
        })
        .when('/change-password/:reset_password_token', {
            controller: 'LoginController',
            templateUrl: 'views/change-password.html'
        })
        .when('/dashboard', {
            controller: 'DashboardController',
            templateUrl: 'views/dashboard.html'
        })
        .when('/deals', {
            controller: 'DashboardController',
            templateUrl: 'views/deals.html'
        })
        .when('/account', {
            controller: 'RegistrationController',
            templateUrl: 'views/dashboard.html'
        })
        .when('/passbook', {
            controller: 'DashboardController',
            templateUrl: 'views/passbook.html'
        })
        .when('/withdraw', {
            controller: 'DashboardController',
            templateUrl: 'views/withdraw.html'
        })
        .when('/partner', {
            controller: 'DashboardController',
            templateUrl: 'views/partner.html'
        })
        .when('/refer', {
            controller: 'DashboardController',
            templateUrl: 'views/refer.html'
        })
        .when('/rewards', {
            controller: '',
            templateUrl: 'views/rewards.html'
        })
        .when('/poker', {
            controller: 'HomeController',
            templateUrl: 'views/home.html',
        })
        .when('/edit-profile', {
            controller: 'RegistrationController',
            templateUrl: 'views/edit-profile.html'
        })
        .when('/about-us', {
            controller: '',
            templateUrl: 'views/about-us.html'
        })
        .when('/contact-us', {
            controller: 'ContactUsController',
            templateUrl: 'views/contact-us.html'
        })
        .when('/blog', {
            controller: 'BlogController',
            templateUrl: 'views/blog.html'
        })
        .when('/blog/:id', {
            controller: 'BlogController',
            templateUrl: 'views/blog-detail.html'
        })
        .when('/rakeback', {
            controller: 'RakebackController',
            templateUrl: 'views/rakeback.html'
        })
        .when('/rakeback/:id', {
            controller: 'RakebackController',
            templateUrl: 'views/rakeback-details.html'
        })
        .when('/leaderboard', {
            controller: 'DashboardController',
            templateUrl: 'views/leaderboard.html'
        })
        .when('/tournaments', {
            controller: 'DealsController',
            templateUrl: 'views/tournaments.html'
        })
        .when('/tournaments/:id', {
            templateUrl: 'views/tournament-details.html'
        })
        .when('/wallet', {
            controller: 'DashboardController',
            templateUrl: 'views/wallet.html'
        })
        .when('/notification', {
            controller: 'NotificationController',
            templateUrl: 'views/notification.html'
        })
        .when('/contests', {
            controller: 'ContestsController',
            templateUrl: 'views/contests-free-tickets.html'
        })
        .when('/contests/:id', {
            controller: 'ContestsController',
            templateUrl: 'views/contests-free-tickets.html'
        })
        .when('/terms-of-use', {
            templateUrl: 'views/terms-of-use.html'
        })
        .when('/rakeback-deals', {
            templateUrl: 'views/rakeback-deals.html'
        })
        .when('/staking', {
            templateUrl: 'views/staking.html'
        })
        .when('/bankroll-management', {
            templateUrl: 'views/bankroll-management.html'
        })
        .when('/more', {
            controller: '',
            templateUrl: 'views/more.html'
        })
        .when('/facebook', {
            templateUrl: 'views/facebook.html'
        })
        .when('/contest-result', {
            controller: 'DashboardController',
            templateUrl: 'views/contest-result.html'
        })
        .when('/email-verification/:emailVerificationToken', {
            controller: 'EmailVerificationController',
            templateUrl: 'views/email-verification.html'
        })
        .when('/404', {
            templateUrl: 'views/404.html'
        })
        .when('/logout', {
            templateUrl: 'views/logout.html',
            controller: 'LogoutController'
        })
        .when('/fantasy', {
            controller: '',
            templateUrl: 'views/fantasy.html'
        })
        .when('/rummy', {
            controller: 'HomeController',
            templateUrl: 'views/rummy/home.html'
        })
        //.when('/rummy-deal', {
        //    controller: 'RummyController',
        //    templateUrl: 'views/rummy/deal.html'
        //})
        .when('/rummy-deal/:id', {
            controller: 'RummyController',
            templateUrl: 'views/rummy/deal.html'
        })
        .when('/feed', {
            controller: 'FeedCtrl',
            templateUrl: 'views/feed.html'
        })
        .when('/poker-bazzi', {
            controller: '',
            templateUrl: 'views/pokerbazzi.html'
        })
        .otherwise({
            redirectTo: '/poker'
        });

    if (window.history && window.history.pushState) {
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }

    $locationProvider.hashPrefix('');

    //alert(window.history);

    // $locationProvider.html5Mode(false).hashPrefix('!');


    // $locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix("!");

    //$locationProvider.html5Mode(true);
    //$locationProvider.hashPrefix('');

    //if (window.history && window.history.pushState) {
    //    $locationProvider.html5Mode({
    //        enabled: true,
    //        requireBase: false
    //    }).hashPrefix('!');
    //}

    //$locationProvider.html5Mode(true);
});

MyApp.directive('loading', ['$http', function ($http) {
    return {
        restrict: 'A',
        //template: '<div class="loading-spiner"><img src="/angular/loader/ajax-loader2.gif" /> </div>',
        template: '<div class="loading-spiner"><div><img src="/angular/loader/ajax-loader.gif"><div>please wait..</div></div><div class="bg"></div></div>',
        link: function (scope, elm, attrs) {
            scope.isLoading = function () {
                return $http.pendingRequests.length > 0;
            };
            scope.$watch(scope.isLoading, function (v) {
                if (v) {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
        }
    };
}]);
