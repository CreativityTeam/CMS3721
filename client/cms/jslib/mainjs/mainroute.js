var mainroute = angular.module("mainroute",[]);

mainroute.config(function($stateProvider, $urlRouterProvider, $locationProvider){

    $urlRouterProvider.otherwise('/');
    $stateProvider
        /*.state('home',{
            url: '/',
            controller : 'dashboardcontroller',
            templateUrl: 'dashboard.html'
        })*/
        .state('user',{
            url: '/',
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
        .state('commentres',{
            url: '/commentres',
            controller : 'rescontroller',
            templateUrl: 'cmt.res.normal.html'
        })
        .state('menures',{
            url: '/menures',
            controller : 'rescontroller',
            templateUrl: 'menu.res.normal.html'
        })
        .state('pubres',{
            url: '/publicityres',
            controller : 'rescontroller',
            templateUrl: 'pub.res.normal.html'
        })
        .state('foodres',{
            url: '/foodres',
            controller : 'rescontroller',
            templateUrl: 'food.res.normal.html'
        })
        .state('orderres',{
            url: '/orderres',
            controller : 'rescontroller',
            templateUrl: 'order.res.normal.html'
        })
        .state('food',{
            url: '/food',
            controller : 'sucontroller',
            templateUrl: 'food.manage.html'
        })
        .state('order',{
            url: '/order',
            controller : 'sucontroller',
            templateUrl: 'order.manage.html'
        })
        .state('category',{
            url: '/category',
            controller : 'sucontroller',
            templateUrl: 'category.html'
        })
        .state('publicity',{
            url: '/publicity',
            controller : 'sucontroller',
            templateUrl: 'pub.manage.html'
        })
        .state('photo',{
            url: '/photo',
            controller : 'photoController',
            templateUrl: 'photo.html'
        })
        .state('service',{
            url: '/service',
            controller : 'sucontroller',
            templateUrl: 'service.res.su.html'
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

