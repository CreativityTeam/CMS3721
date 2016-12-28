var resctrl = angular.module("resctrl",[]);

resctrl.controller("rescontroller",function($rootScope,$scope,$http,AuthService,API_ENDPOINT,toaster,$q,$window){
    /**Set Register Form to Hide */
    var map;
    $('#resform').hide();
    $scope.isvalidateadd = true;
    $scope.isfilledAdd = false;       
    /**Get restaurant that belong to current user */
    var getRestaurant = function(){
        $http.get(API_ENDPOINT.url + '/api/restaurants/findad/' + AuthService.tokensave()).success(function(response){
            if(response.success){
                $scope.restaurantBelongUser = response.data;    
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

    /**Process when Add restaurant click */
    $scope.showformres = function(){
        $scope.isClickAddButton = true;
        $('#resform').fadeIn(1500);
    };

    /**Process form thats closed */
    $scope.hideformres = function(){
        $scope.isClickAddButton = false;
        $scope.isClickEditButton = false;
        $scope.restaurant = null;
        $scope.isfilledAdd = false;
        $('#resform').fadeOut(1000);
    };

    var getNameAddress = function(){
        return $q(function(resolve,reject){
            $http.get("jslib/config/countryVN.json").then(function(data){
                var nameStreet = $scope.restaurant.housenumber + " " + $scope.restaurant.street;
                var nameCity = data.data.city[$scope.restaurant.city.id - 1].name;
                var nameDistrict = data.data.city[$scope.restaurant.city.id - 1].Quan[$scope.restaurant.district.id - 1].name;
                var address = {
                    street : nameStreet,
                    district : nameDistrict,
                    city : nameCity,
                    fullName : nameStreet + ", " + nameDistrict + ", " + nameCity,
                    queryName : $scope.restaurant.street + ", " + nameDistrict + ", " + nameCity
                }
                resolve(address);
            }); 
        });
    }

    /**Check Address */
    $scope.validateadd= function(){
        var promise = getNameAddress();
        promise.then(function(dataAddress){
            $http.get("https://maps.googleapis.com/maps/api/geocode/json?v=3.27&address=" + dataAddress.district + dataAddress.city + "&key=AIzaSyCtZg8ZpyEFjRqin6kdAvckjKAT7M-hd_g").success(function(response){
                initmap(response,dataAddress);
            });
        });    
        $scope.isvalidateadd = false;
        $scope.isfilledAdd = true;
    }

    function initmap(addressList,dataAddress){
        $scope.oldAddress = dataAddress;
        var position = {
            lat: addressList.results[0].geometry.location.lat, 
            lng: addressList.results[0].geometry.location.lng
        };
        map = new google.maps.Map(document.getElementById('map'), {
          zoom: 12,
          center:  position
        });
        var marker = new google.maps.Marker({
                position: position,
                animation: google.maps.Animation.DROP,
                draggable:true,
                map: map
            });
        var infoWindow = new google.maps.InfoWindow({
                content: dataAddress.fullName
        });
        $scope.mapPosition = {
               lat : position.lat,
               lng : position.lng
        };
        marker.addListener('dragend', function() {
            $scope.mapPosition = {
               lat : marker.getPosition().lat().toFixed(3),
               lng : marker.getPosition().lng().toFixed(3)
           }
        });
    }
    
    $scope.submitres = function(){
        $scope.errormsg = false;
        $scope.saveRestaurant = {
            _id : $scope.user._id,
            name : $scope.restaurant.res_name,
            description : $scope.restaurant.description,
            housenumber : $scope.restaurant.housenumber,
            street : $scope.restaurant.street,
            district : $scope.oldAddress.district,
            city :  $scope.oldAddress.city,
            longitude : $scope.mapPosition.lng,
            latitude : $scope.mapPosition.lat
        }
        if($scope.isClickEditButton){
            $http.put(API_ENDPOINT.url + '/api/restaurants/updateinfo/' + $scope.restaurant.id,$scope.saveRestaurant).success(function(data){
                getRestaurant();
            });    
        }else{
            $http.post(API_ENDPOINT.url + '/api/restaurants/register',$scope.saveRestaurant).success(function(data){
                getRestaurant();
            });
        }
    }
    var loadCity = function(){
        $http.get("jslib/config/countryVN.json").then(function(data){
            $scope.cities = data.data.city;
        })
    }

    $scope.loadDistrict = function(){
        $http.get("jslib/config/countryVN.json").then(function(data){
            for(var i = 0;i < data.data.city.length;i++){
                /**Cach viet 1 */
                if(data.data.city[i].id == $scope.restaurant.city.id){
                        $scope.districts = data.data.city[i].Quan   
                }
            }
        })    
    }

    /**Get all restaurant */
    var getAllRestaurant = function(){
        $http.get(API_ENDPOINT.url + '/api/restaurants/findres').success(function(data){
            $scope.listRestaurant = data.data;
        });
    };

    /**Open Map */
    $scope.openMap = function(location){
        $window.open("http://www.google.com/maps/place/" + location.latitude + "," + location.longitude + "/@" + location.latitude + "," + location.longitude + ",17z");
    }

    /**Edit restaurant */
    $scope.edit = function(id){
        $scope.isClickEditButton = true;
        $scope.isClickAddButton = true;
        $('#resform').fadeIn(1500);
        $http.get(API_ENDPOINT.url + '/api/restaurants/findinfo/' + id).success(function(data){
            $scope.restaurant = {
                id: data.data._id,
                res_name : data.data.res_name,
                description : data.data.description,
                housenumber : data.data.location.housenumber,
                street : data.data.location.street,
            }
        });
    }

    /**Delete Restaurant */
    $scope.delete = function(id) {
        $scope.restaurant = null;
        $scope.isClickEditButton = false;
        for(var i in $scope.restaurantBelongUser){
            if($scope.restaurantBelongUser[i]._id == id){
                $scope.restaurantBelongUser.splice(i,1);
            }
        }
        $http.delete(API_ENDPOINT.url + '/api/restaurants/deleteRestaurant/' + id).success(function(data){
            getRestaurant();
        });
    }
    loadCity();
    getRestaurant();
    getCurrentUser();
    getAllRestaurant();
});