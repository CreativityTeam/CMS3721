var resctrl = angular.module("resctrl",[]);

resctrl.controller("rescontroller",function($scope,$http,AuthService,API_ENDPOINT,toaster){
    /**Get restaurant that belong to current user */
    var getRestaurant = function(){
        $http.get(API_ENDPOINT.url + '/api/restaurants/findad/' + AuthService.tokensave()).success(function(response){
            if(response.success){
                $scope.restaurant = response.data;    
                $scope.ishaveres = false; 
            }else{
                $scope.errormsg = response.msg;
                $scope.ishaveres = true;     
            }
        });
    }

    var getCurrentUser = function(){
        $http.get(API_ENDPOINT.url + '/api/users/findone/' + AuthService.tokensave()).success(function(response){
            if(response.success){
                $scope.user = response.data;
            }
        });
    } 

    $scope.createnewres = function(){
        /*$http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + $scope.location + "&key=AIzaSyCtZg8ZpyEFjRqin6kdAvckjKAT7M-hd_g").success(function(response){
            console.log(response);
        });*/
    };

    getRestaurant();
    getCurrentUser();
});