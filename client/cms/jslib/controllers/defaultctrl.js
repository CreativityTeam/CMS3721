var defaultctrl = angular.module('defaultctrl',[]);

defaultctrl.controller("DefaultController",function($scope,$http,AuthService,$window,API_ENDPOINT){
    $scope.list = "";
    $scope.isHide = {
        supperUser : true,
        user : true,
        res : true,
        comment : true,
        food : true,
        order : true,
        message : true,
        public : true,
        service : true
    };
    var getinfo = function(){
        if(AuthService.isAuthenticated()){
                $http.get(API_ENDPOINT.url + '/api/users/findone/' + AuthService.tokensave()).success(function(response){
                $scope.name = response.data.local.name;
                if(response.data.role == "SupperUser"){
                    $scope.isHide.supperUser = false;
                    $scope.list = "list";
                }
            });
        }
    };

    getinfo();

    $scope.logout = function(){
        AuthService.logout();
        $window.location.href = "/";
    };

    $scope.manageuser = function(){
        $scope.isHide.user = $scope.isHide.user == true ? false : true ;   
    };
    $scope.managerestaurant = function(){
        $scope.isHide.res = $scope.isHide.res == true ? false : true ;   
    };
});