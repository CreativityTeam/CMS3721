var mainroute = angular.module("mainroute",[]);

mainroute.config(function($stateProvider, $urlRouterProvider, $locationProvider){

    $urlRouterProvider.otherwise('/');
    $stateProvider
        .state('home',{
            url: '/',
            templateUrl: 'dashboard.html'
        })
        .state('user',{
            url: '/user',
            controller : 'usercontroller',
            templateUrl: 'user.html'
        })
        .state('usermanage',{
            url: '/usermanage',
            controller : 'usercontroller',
            templateUrl: 'user.res.su.html'
        })
        .state('restaurant',{
            url: '/restaurant',
            controller : 'rescontroller',
            templateUrl: 'res.res.normal.html'
        })
        .state('restaurantmanager',{
            url: '/resmanager',
            controller : 'rescontroller',
            templateUrl: 'res.manage.html'
        })
        .state('comment',{
            url: '/comment',
            templateUrl: 'cmt.manager.html'
        })
        .state('commentres',{
            url: '/commentres',
            controller : 'rescontroller',
            templateUrl: 'cmt.res.normal.html'
        })
        .state('reservice',{
            url: '/serviceres',
            controller : 'rescontroller',
            templateUrl: 'service.res.normal.html'
        })
        .state('food',{
            url: '/food',
            templateUrl: 'icons.html'
        })
        .state('order',{
            url: '/order',
            templateUrl: 'notifications.html'
        })
        .state('message',{
            url: '/message',
            templateUrl: 'notifications.html'
        })
        .state('publicity',{
            url: '/publicity',
            templateUrl: 'notifications.html'
        })
        .state('photo',{
            url: '/photo',
            controller : 'photoController',
            templateUrl: 'photo.html'
        })
        .state('service',{
            url: '/service',
            templateUrl: 'notifications.html'
        });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
        });
    $locationProvider.hashPrefix('!');
});

mainroute.run(function($rootScope,$state,AuthService,$window){
    $rootScope.$on('$stateChangeStart',function(event,next,nextParams,fromState){
        if(!AuthService.isAuthenticated()){
            if(next.name != 'login' && next.name != 'register'){
                event.preventDefault();
                $window.location.href = '/login.html';
            };
        }
    });
});

