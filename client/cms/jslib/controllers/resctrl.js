var resctrl = angular.module("resctrl",[]);

resctrl.controller("rescontroller",function($rootScope,$scope,$http,AuthService,API_ENDPOINT,toaster,NgMap,NavigatorGeolocation){
    /**Set Register Form to Hide */
    $('#resform').hide(); 
    $scope.isfilledAdd = false;       
    /**Get restaurant that belong to current user */
    var getRestaurant = function(){
        $http.get(API_ENDPOINT.url + '/api/restaurants/findad/' + AuthService.tokensave()).success(function(response){
            if(response.success){
                $scope.restaurant = response.data;    
            }else{
                $scope.errormsg = response.msg; 
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

    $scope.showformres = function(){
        $('#resform').fadeIn(1500);
    };

    $scope.validateadd= function(){
        let addressList= [];  
        $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + $scope.restaurant.address + "&key=AIzaSyCtZg8ZpyEFjRqin6kdAvckjKAT7M-hd_g").success(function(response){
            var results = response.results;
            console.log(response);
            for(address in results){  
                addressList.push(results[address].geometry.location);
            }
        });
        $scope.addressResult = addressList;
        console.log(addressList);
        $scope.isfilledAdd = true;
    }

    $scope.open = function(){
        NgMap.getMap().then(function(map) {
            infowindow.open(map);
        });
    }

    getRestaurant();
    getCurrentUser();
});