var loginctrl = angular.module('loginctrl',[]);

loginctrl.controller('logincontroler',function($scope,$http,$state,AuthService,API_ENDPOINT){

    $scope.aleretinfo = function(){
        alert("This function is called from Login page");
    };

    $scope.loginlocal = function(){
        AuthService.login($scope.user).then(function(msg){
            $state.go('home');
        },function(errMsg){
            console.log(errMsg);
        });
    };
});