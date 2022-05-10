angular.module('WhisperingShoutsAppAdmin', ['ngRoute'])
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/login', {
                controller: 'LoginController',
                templateUrl: 'views/login.html'
            })
            .when('/dashboard', {
                controller: 'DashboardController',
                templateUrl: 'views/dashboard.html'
            })              
            .when('/identities', {
                controller: 'IdentitiesController',
                templateUrl: 'views/identities.html'
            }) 
            .when('/announcements', {
                controller: 'MarketingController',
                templateUrl: 'views/announcements.html'
            }) 
            .when('/announcements/:announcement_id', {
                controller: 'MarketingController',
                templateUrl: 'views/announcements.html'
            }) 
            .when('/passbooks', {
                controller: 'PassbookController',
                templateUrl: 'views/passbooks.html'
            }) 
            .when('/leaderboard', {
                controller: 'LeaderboardController',
                templateUrl: 'views/leaderboard.html'
            }) 
            .when('/leaderboard/:leaderboard_id', {
                controller: 'LeaderboardController',
                templateUrl: 'views/leaderboard.html'
            }) 
            .when('/rewards', {
                controller: 'RewardsController',
                templateUrl: 'views/rewards.html'
            }) 
            .when('/withdraw-request', {
                controller: 'WithdrawRequestController',
                templateUrl: 'views/withdraw-request.html'
            }) 
            .when('/rakeback-stats', {
                controller: 'RakebackController',
                templateUrl: 'views/rakeback-stats.html'
            })
            .when('/blog', {
                controller: 'BlogController',
                templateUrl: 'views/blog.html'
            }) 
            .when('/contests', {
                controller: 'ContestsController',
                templateUrl: 'views/contests.html'
            }) 
            .when('/notification', {
                controller: 'NotificationController',
                templateUrl: 'views/notification.html'
            })
            .when('/kyc-request', {
                controller: 'KYCController',
                templateUrl: 'views/kyc-request.html'
            }) 
            .when('/users', {
                controller: 'UsersController',
                templateUrl: 'views/users.html'
            }) 
            .when('/404', {
                templateUrl: 'views/404.html'
            })
            .when('/logout', {
                templateUrl: 'views/logout.html',
                controller: 'LogoutController'
            })
            .otherwise({
                redirectTo: '/login'
            });

        $locationProvider.html5Mode(false).hashPrefix('!');

        //if (window.history && window.history.pushState) {
        //    $locationProvider.html5Mode({
        //        enabled: true,
        //        requireBase: false
        //    });
        //}

        //$locationProvider.hashPrefix('');
    });  