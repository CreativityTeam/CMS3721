var basectrl = angular.module('basectrl',[]);

basectrl.controller('homecontroler',function($scope,$http,AuthService,$state,API_ENDPOINT){

    $scope.aleretinfo = function(){
        alert("This function is called from home page");
    };

    var getinfo = function(){
        $http.get(API_ENDPOINT.url + '/api/users/findone/' + AuthService.tokensave()).success(function(response){
            $scope.user = response.data;
        });
    };

    getinfo();

    $scope.getres = function(){
        $http.get(API_ENDPOINT.url + '/api/users/findone/' + AuthService.tokensave()).success(function(response){
            if(response.success){
                console.log(response.data);
                $http.get(API_ENDPOINT.url + '/api/restaurants/findad/' + response.data._id).success(function(response){
                    if(response.success){
                        console.log(response.data);
                    }
                });
            }
        });
    };

    $scope.logout = function(){
         AuthService.logout();
         $state.go('login')
    };

    $scope.getToken = function(){
         console.log(AuthService.tokensave());
    };
});