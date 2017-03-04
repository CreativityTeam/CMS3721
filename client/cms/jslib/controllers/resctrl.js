var resctrl = angular.module("resctrl",[]);

resctrl.controller("rescontroller",function($rootScope,$scope,$http,AuthService,API_ENDPOINT,toaster,$q,$window,Upload){
    var map;
    $('#resform').hide();
    /**Set Register Form to Hide */
    $scope.isvalidateadd = true;
    $scope.isfilledAdd = false;       
    /**Get restaurant that belong to current user */
    var getRestaurant = function(){
        if(AuthService.getCurrentUser().role === "SuperUser"){
            $http.get(API_ENDPOINT.url + '/api/restaurants/findres').success(function(data){
                $scope.restaurantBelongUser = data.data;
            });   
        }else{
            $http.get(API_ENDPOINT.url + '/api/restaurants/findad/' + AuthService.tokensave()).success(function(response){
                if(response.success){
                    $scope.restaurantBelongUser = response.data;
                }else{
                    $scope.errormsg = response.msg; 
                }
            });
        }
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
            type : $scope.restaurant.type,
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
                toaster.pop('success',"Status",data.msg);
            });    
        }else{
            $http.post(API_ENDPOINT.url + '/api/restaurants/register',$scope.saveRestaurant).success(function(data){
                getRestaurant();
                $scope.restaurant = null;
                toaster.pop('success',"Status",data.msg);
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
            toaster.pop('error',"Status",data.msg);
        });
    }

    /**--------------------- */
    /**Start Comment Controller */
    /**--------------------- */
    /**Get commend restaurant */
    $scope.getCommend = function(){
        $http.get(API_ENDPOINT.url + '/api/restaurants/findcomment/' + $scope.restaurant._id).success(function(data){
                $scope.listComment = data.data;
                $http.get(API_ENDPOINT.url + '/api/foods/findcommentres/' + $scope.restaurant._id).success(function(data){
                    for(var i in data.data){
                        for(var t in data.data[i].comments){
                            $scope.listComment.push(data.data[i].comments[t]);    
                        } 
                    }  
                });
        });   
    }

    /**Delete Commend */
    $scope.deleteCommend = function(idres,idcmt){
        for(var i in $scope.listComment){
            if($scope.listComment[i]._id == idcmt){
                $scope.listComment.splice(i,1);
            }
        }
        $http.delete(API_ENDPOINT.url + '/api/comments/deletecomment/' + idcmt).success(function(data){
            if(data.success){
                toaster.pop('error',"Status",data.msg);
            }
        });
    }

    /**Report Commend */
     $scope.reportCommend = function(id,comment){
        if(comment.is_reported){
            comment.is_reported = false;
        }else{
            comment.is_reported = true; 
        }
        $http.put(API_ENDPOINT.url + '/api/comments/updateinfo/' + id,comment).success(function(data){
            toaster.pop('success',"Status",data.msg);
        });   
    }

    /**--------------------- */
    /**End Comment Controller */
    /**--------------------- */

    /**--------------------- */
    /**Start Publicities Function */
    /**--------------------- */
    $scope.listNumPub = [{num : 1},{num : 2},{num : 3},{num : 4},{num : 5},{num : 6}]
    $scope.savePub = function(file,publicity){

        if(publicity != undefined){
            if(publicity.publicity_name == ""
            || publicity.publicity_price == ""
            || publicity.publicity_desciption == "")
            {
                toaster.pop('error',"System Status","Some fields is missing"); 

            } else if(!publicity.hasOwnProperty('_id') && file == undefined){

                 toaster.pop('error',"System Status","You have to upload at lease one photo"); 

            }else if(!publicity.hasOwnProperty('_id') && file != undefined){
                $http.post(API_ENDPOINT.url + '/api/publicities/create/' , publicity).success(function(responseCreate){
                    
                    if(responseCreate.success){

                        file.upload = Upload.upload({
                                url: API_ENDPOINT.url + '/api/photos/addphoto',
                                data: {file: file},
                        });
                        file.upload.then(function (responsePhoto) {
                            responseCreate.data.photo = API_ENDPOINT.urlHost + responsePhoto.data.data.url;
                            console.log(responseCreate.data)
                            $http.put(API_ENDPOINT.url + '/api/publicities/updateinfo/' + responseCreate.data._id, responseCreate.data).success(function(responseUpdate){
                                if(responseUpdate.success){
                                        getPubLicities();
                                        toaster.pop('success',"Update Status",responseUpdate.msg);
                                    }    
                                });    
                            }, function (response) {
                            if (response.status > 0)
                                $scope.errorMsg = response.status + ': ' + response.data;
                        }); 
                    }    
                }); 

            } else if(publicity.hasOwnProperty('_id') && publicity.hasOwnProperty('photo') && file == undefined){
                
                    $http.put(API_ENDPOINT.url + '/api/publicities/updateinfo/' + publicity._id, publicity).success(function(responseUpdate){
                    if(responseUpdate.success){
                            getPubLicities();
                            toaster.pop('success',"Update Status",responseUpdate.msg);
                        }    
                    });  
              
            }else if(publicity.hasOwnProperty('_id') && publicity.hasOwnProperty('photo') && file != undefined){

                  file.upload = Upload.upload({
                            url: API_ENDPOINT.url + '/api/photos/addphoto',
                            data: {file: file},
                    });
                    file.upload.then(function (responsePhoto) {
                        publicity.photo = API_ENDPOINT.urlHost + responsePhoto.data.data.url;
                        $http.put(API_ENDPOINT.url + '/api/publicities/updateinfo/' + publicity._id, publicity).success(function(responseUpdate){
                            if(responseUpdate.success){
                                    getPubLicities();
                                    toaster.pop('success',"Update Status",responseUpdate.msg);
                                }    
                            });    
                        }, function (response) {
                        if (response.status > 0)
                            $scope.errorMsg = response.status + ': ' + response.data;
                    }); 

            }

        }
        
    }

    var getPubLicities = function(){
        $http.get(API_ENDPOINT.url + '/api/publicities/findAllPublicity').success(function(responseGet){
            $scope.publicity1 = responseGet.data[0]
            $scope.publicity2 = responseGet.data[1]
            $scope.publicity3 = responseGet.data[2]
            $scope.publicity4 = responseGet.data[3]
            $scope.publicity5 = responseGet.data[4]
            $scope.publicity6 = responseGet.data[5]
        })
    }

    getPubLicities()

    /**--------------------- */
    /**End Publicities Function */
    /**--------------------- */

     /**--------------------- */
    /**Start Food Function */
    /**--------------------- */
    $scope.showFormFood = function(){
        $scope.isClickAddButtonFood = true;
        $scope.isClickEditButtonFood = false;
        $scope.food = null;
    }
    $scope.hideFormFood = function(){
        $scope.isClickAddButtonFood = false;
        $scope.isClickEditButtonFood = false;
        $scope.food = null;
    }
    $scope.loadFood = function(){
         $scope.isRestaurantSelected = true;
         $http.get(API_ENDPOINT.url + '/api/foods/findres/' + $scope.restaurant._id).success(function(data){
                $scope.listFood = data.data;
        }); 
    }
    $scope.editFood = function(idFood){
        $scope.isClickAddButtonFood = true;
        $scope.isClickEditButtonFood = true;
        $http.get(API_ENDPOINT.url + '/api/foods/findinfo/' + idFood).success(function(data){
                $scope.food = data.data;
        }); 
    }
    $scope.addFood = function(){
        if($scope.isClickEditButtonFood){
            $http.put(API_ENDPOINT.url + '/api/foods/updateinfo/' + $scope.food._id,$scope.food).success(function(data){
                toaster.pop('success',"Status",data.msg);
                $scope.loadFood();
                $scope.hideFormFood();
            });    
        }else{
        $scope.food.res_belong = $scope.restaurant._id;
        $http.post(API_ENDPOINT.url + '/api/foods/create',$scope.food).success(function(data){
                    toaster.pop('success',"Status",data.msg);
                    $scope.loadFood();
                    $scope.food = null;
            });
        }    
    }
    $scope.deleteFood = function(idFood){
        for(var i in $scope.listFood){
            if($scope.listFood[i]._id == idFood){
                $scope.listFood.splice(i,1);
            }
        }
        $http.delete(API_ENDPOINT.url + '/api/foods/deletefood/' + idFood).success(function(data){
            if(data.success){
                toaster.pop('error',"Status",data.msg); 
            }
        });  
    }
    /**--------------------- */
    /**End Food Function */
    /**--------------------- */

    /**--------------------- */
    /**Start Menu Function */
    /**--------------------- */
    $scope.showFormMenu = function(){
        $scope.isClickAddButtonMenu= true;
        $scope.menu = null;
    }
    $scope.hideFormMenu = function(){
        $scope.isClickAddButtonMenu = false;
        $scope.menu = null;
    }
    $scope.loadMenu = function(){
         $scope.isRestaurantSelected = true;
         $scope.listMenuFood = []; 
         var count = 0;
         $http.get(API_ENDPOINT.url + '/api/restaurants/getListMenu/' + $scope.restaurant._id).success(function(data){
                $scope.listMenu = data.data;
                for(var menuItem in $scope.listMenu.menus){
                    $http.get(API_ENDPOINT.url + '/api/foods/findfoodbymenu/' + $scope.listMenu.menus[menuItem]._id).success(function(data){
                        $scope.listMenuFood.push({
                            count : count,
                            foodArray : data.data,
                            menuInfor : data.data[0].menu.name,
                            id : data.data[0].menu._id
                        })
                        console.log($scope.listMenuFood)
                        count++;
                    })   
                }
        }); 
    }
    $scope.editMenu = function(idMenu){
        $scope.isClickEditButtonMenu = true;
        $scope.isClickAddButtonMenu= true;
        $http.get(API_ENDPOINT.url + '/api/menus/getMenuID/' + idMenu).success(function(data){
                $scope.menu = data.data;
        }); 
    }
    $scope.addMenu = function(){
        if($scope.isClickEditButtonMenu){
            $http.put(API_ENDPOINT.url + '/api/menus/updateMenu/' + $scope.menu._id,$scope.menu).success(function(data){
                $scope.loadMenu();
                $scope.isClickEditButtonMenu = false;
                $scope.hideFormMenu();
            });    
        }else{
        $http.post(API_ENDPOINT.url + '/api/menus/create',$scope.menu).success(function(data){
            if(data.success){
                $http.put(API_ENDPOINT.url + '/api/restaurants/updatemenu/' + $scope.restaurant._id + '/' + data.data._id).success(function(data){
                    toaster.pop('success',"Status",data.msg);
                    $scope.loadMenu();
                    $scope.menu = null;
                });  
                }
            });
        }    
    }
    $scope.deleteMenu = function(idMenu,idRes){
        for(var i in $scope.listMenu.menus){
            if($scope.listMenu.menus[i]._id == idMenu){
                $scope.listMenu.menus.splice(i,1);
            }
        }
        $http.delete(API_ENDPOINT.url + '/api/menus/delete/' + idMenu).success(function(data){
            if(data.success){
                $http.delete(API_ENDPOINT.url + '/api/restaurants/deletemenu/' + idRes + '/' + idMenu).success(function(data){}); 
                toaster.pop('error',"Status","Delete Successfully"); 
            }
        }); 
    }
    $scope.removeFoodInMenu = function(idFood){
        for(var i in $scope.listMenuFood){
            for(var t in $scope.listMenuFood[i].foodArray){
                if($scope.listMenuFood[i].foodArray[t]._id == idFood){
                    $scope.listMenuFood[i].foodArray.splice(t,1);
                }
            }
        }
        $http.put(API_ENDPOINT.url + '/api/foods/removeFoodFromMenu/' + idFood).success(function(data){
            if(data.success){
                $scope.loadMenu();
            }
        });    
    }
    /**--------------------- */
    /**End Menu Function */
    /**--------------------- */

    /**--------------------- */
    /**Order Function */
    /**--------------------- */
    $scope.loadOrder = function(){
         $scope.isRestaurantSelectedInOrder = true;
         $scope.listOrder = [];
         $http.get(API_ENDPOINT.url + '/api/orders/findAllOrder').success(function(data){
             for(var item in data.data){
                 if(data.data[item].res_belong != "" && data.data[item].res_belong._id ==  $scope.restaurant._id){
                        $scope.listOrder.push({
                        count : item,
                        user_order_name : data.data[item].user_order.local.name,
                        locationorder : data.data[item].location_ordered.address,
                        res_belong : data.data[item].res_belong,
                        shippingstatus : data.data[item].shippingstatus,
                        paymentstatus : data.data[item].paymentstatus,
                        feeshipping : data.data[item].feeshipping,
                        time_ordered : data.data[item].time_ordered,
                        total_price : data.data[item].total_price,
                        foods : data.data[item].foods,
                        shipper_name : data.data[item].shipper.local.name,                 
                    });
                 }
             }
        }); 
    }

    var getListMenuFood = function(){
         $http.get(API_ENDPOINT.url + '/api/menus/getListMenu').success(function(response){
            $scope.listMenuFood = response.data;
        });
    };

    var getCategoryRestaurant = function(){
        $scope.listCategoryRestaurant = [];
         $http.get(API_ENDPOINT.url + '/api/categories/getList').success(function(response){
            for(var item in response.data){
                if(response.data[item].mainCategory == "Restaurant"){
                    $scope.listCategoryRestaurant.push(response.data[item]);
                }
            }
        });
    }

    getCategoryRestaurant()
    getListMenuFood()
    loadCity();
    getRestaurant();
    getCurrentUser();
    getAllRestaurant();
});