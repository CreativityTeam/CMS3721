var defaultctrl = angular.module('defaultctrl',[]);

defaultctrl.controller("DefaultController",function($scope,$http,AuthService,$window,API_ENDPOINT){
    $scope.list = "";
    $scope.isHide = {
        superUser : true,
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
                $scope.name = AuthService.getCurrentUser().local.name;
                if(AuthService.getCurrentUser().role == "SuperUser"){
                    $scope.isHide.superUser = false;
                    $scope.list = "list";
                }
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