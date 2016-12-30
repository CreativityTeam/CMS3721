var resctrl = angular.module("resctrl",[]);

resctrl.controller("rescontroller",function($rootScope,$scope,$http,AuthService,API_ENDPOINT,toaster,$q,$window){
    var map;
    $('#resform').hide();
    /**Set Register Form to Hide */
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
        $scope.isClickEditButton = false;
        $scope.restaurant = null;
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
            latitude : $scope.mapPosition.lat,
            photo1 :  $scope.restaurant.photo1,
            photo2 :  $scope.restaurant.photo2,
            photo3 :  $scope.restaurant.photo3,
            photo4 :  $scope.restaurant.photo4,
            photo5 :  $scope.restaurant.photo5
        }
        if($scope.isClickEditButton){
            $http.put(API_ENDPOINT.url + '/api/restaurants/updateinfo/' + $scope.restaurant.id,$scope.saveRestaurant).success(function(data){
                getRestaurant();
            });    
        }else{
            $http.post(API_ENDPOINT.url + '/api/restaurants/register',$scope.saveRestaurant).success(function(data){
                getRestaurant();
                $scope.restaurant = null;
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
                photo1 : data.data.photo1,
                photo2 : data.data.photo2,
                photo3 : data.data.photo3,
                photo4 : data.data.photo4,
                photo5 : data.data.photo5
            }
        });
    }

    /**--------------------- */
    /**Start Comment Controller */
    /**--------------------- */
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

    /**Get commend restaurant */
    $scope.getCommend = function(){
        for(var i in $scope.restaurantBelongUser){
            if($scope.restaurantBelongUser[i]._id == $scope.restaurant._id && $scope.restaurantBelongUser[i].comments.length != 0){
                loadComment();    
            }
        }   
    }

    /**Delete Commend */
    $scope.deleteCommend = function(idres,idcmt){
        for(var i in $scope.listComment){
            if($scope.listComment[i]._id == idcmt){
                $scope.listComment.splice(i,1);
            }
        }
        $http.delete(API_ENDPOINT.url + '/api/comments/deletecomment' + id).success(function(data){
            if(data.success){
                $http.delete(API_ENDPOINT.url + '/api/restaurants/deletecomment/' + idres +'/' + idcmt).success(function(data){});  
            }
        });
    }

    /**Report Commend */
     $scope.reportCommend = function(id,isreported){
        if(isreported){
            $scope.is_reported = false;
        }else{
           $scope.is_reported = true; 
        }
        $http.put(API_ENDPOINT.url + '/api/comments/updateinfo' + id,$scope.is_reported).success(function(data){
            loadComment();
        });   
    }

    var loadComment = function(){
        $http.delete(API_ENDPOINT.url + '/api/restaurants/findcomment/' + $scope.restaurant._id).success(function(data){
                $scope.listComment = data.data;
        });    
    }
    /**--------------------- */
    /**End Comment Controller */
    /**--------------------- */

    /**--------------------- */
    /**Start Service Function */
    /**--------------------- */
    $scope.showFormService = function(){
        $scope.isClickAddButtonService = true;
        $scope.isEditService = false;
        $scope.service = null
    }

    $scope.hideFormService = function(){
        $scope.isClickAddButtonService = false;
        $scope.isEditService = false;
        $scope.service = null;
    }

    $scope.loadService = function(){
         $scope.isRestaurantSelected = true;
         $http.get(API_ENDPOINT.url + '/api/restaurants/findservice/' + $scope.restaurant._id).success(function(data){
                $scope.listService = data.data;
        }); 
    }

    /**Submit service */
    $scope.registerService = function(idres){
        if($scope.isEditService){
            $http.put(API_ENDPOINT.url + '/api/services/updateinfo/' + $scope.service._id,$scope.service).success(function(data){
                $scope.loadService();
            });    
        }else{
        $http.post(API_ENDPOINT.url + '/api/services/create',$scope.service).success(function(data){
            if(data.success){
                $http.put(API_ENDPOINT.url + '/api/restaurants/updateservices/' + $scope.restaurant._id + '/' + data.data._id).success(function(data){
                    $scope.loadService();
                    $scope.service = null;
                });  
                }
            });
        }
    }

    /**Edit service */
    $scope.editService = function(idservice){
        $scope.isEditService = true;  
        $scope.isClickAddButtonService = true;
        $http.get(API_ENDPOINT.url + '/api/services/findinfo/' + idservice).success(function(data){
                $scope.service = data.data;
        }); 
    }

    /**Delete Service */
    $scope.deleteService = function(idres,idserv){
         for(var i in $scope.listService){
            if($scope.listService[i]._id == idserv){
                $scope.listService.splice(i,1);
            }
        }
        $http.delete(API_ENDPOINT.url + '/api/services/deleteservice/' + idserv).success(function(data){
            if(data.success){
                $http.delete(API_ENDPOINT.url + '/api/restaurants/deleteservice/' + idres +'/' + idserv).success(function(data){});  
            }
        });    
    }
    /**--------------------- */
    /**End Service Function */
    /**--------------------- */
    $scope.showFormPub = function(){
        $scope.isClickAddButtonPublicity = true;
        $scope.publicity = null;
    }
    $scope.hideFormPub = function(){
        $scope.isClickAddButtonPublicity = false;
        $scope.publicity = null;
    }
    $scope.loadPublicity = function(){
         $scope.isRestaurantSelected = true;
         $http.get(API_ENDPOINT.url + '/api/restaurants/findpublicity/' + $scope.restaurant._id).success(function(data){
                $scope.listPublicity = data.data;
        }); 
    }
    /**--------------------- */
    /**Start Publicities Function */
    /**--------------------- */
    loadCity();
    getRestaurant();
    getCurrentUser();
    getAllRestaurant();
});