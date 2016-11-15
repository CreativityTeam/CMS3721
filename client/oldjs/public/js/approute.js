var approute = angular.module('approute',[]);

approute.config(function($stateProvider, $urlRouterProvider, $locationProvider){

    $urlRouterProvider.otherwise('/register');
    $stateProvider
        .state('home',{
            url: '/',
            templateUrl: 'home.html',
            controller: 'homecontroler'
        })
        .state('about',{
            url :'/about',
            templateUrl: 'About.html',
            controller: 'aboutcontroller'
        })
        .state('login',{
            url :'/login',
            templateUrl: 'login.html',
            controller: 'logincontroler'
        })
         .state('register',{
            url :'/register',
            templateUrl: 'register.html',
            controller: 'registercontroler'
        });
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
        });
    $locationProvider.hashPrefix('!');
});

approute.run(function($rootScope,$state,AuthService){
    $rootScope.$on('$stateChangeStart',function(event,next,nextParams,fromState){
        if(!AuthService.isAuthenticated()){
            if(next.name != 'login' && next.name != 'register'){
                event.preventDefault();
                $state.go('login');
            };
        }
    });
});
