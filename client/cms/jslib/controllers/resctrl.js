var resctrl = angular.module("resctrl",[]);

resctrl.controller("rescontroller",function($rootScope,$scope,$http,AuthService,API_ENDPOINT,toaster){
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
        $http.get("https://maps.googleapis.com/maps/api/geocode/json?address=" + $scope.restaurant.address + "&key=AIzaSyCtZg8ZpyEFjRqin6kdAvckjKAT7M-hd_g").success(function(response){
            initmap(response);
        });
        $scope.isfilledAdd = true;
    }

    function initmap(addressList){
        var position = {
            lat: addressList.results[0].geometry.location.lat, 
            lng: addressList.results[0].geometry.location.lng
        };
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center:  position
        });
        for(address in addressList.results){
            var marker = new google.maps.Marker({
                position: addressList.results[address].geometry.location,
                map: map
            }); 
        }
    }

    getRestaurant();
    getCurrentUser();
});