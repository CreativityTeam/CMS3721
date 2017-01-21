var suctrl = angular.module("suctrl",[]);

suctrl.controller("sucontroller", function($q,$scope,$http,AuthService,API_ENDPOINT,toaster){
    $scope.isvalidateadd = true;
    $scope.isfilledAdd = false;
    $scope.mainListCategory = [
        {
            name : 'Restaurant'
        },{
            name : 'Loisir'
    }];
    var getListFood = function(){
        $http.get(API_ENDPOINT.url + '/api/foods/findResBelongName').success(function(response){
            $scope.listFood = response.data;
        });
    };   
    var getListOder = function(){
        $http.get(API_ENDPOINT.url + '/api/orders/getResName').success(function(response){
            $scope.listOrder = response.data;
        });   
    }
    var getListPublicity = function(){
        $scope.listPublicity = []
        $http.get(API_ENDPOINT.url + '/api/restaurants/getAllPublicity').success(function(response){
            for(var item in response.data){
                if(response.data[item].publicities.length != 0){
                    $scope.listPublicity.push({
                        res_name : response.data[item].res_name,
                        publicities : response.data[item].publicities
                    });
                }
            }
        });
    }
    /**Category ctrl */
    var getListCategory = function(){
         $http.get(API_ENDPOINT.url + '/api/categories/getList').success(function(response){
            if(response.success == true){
                $scope.listCategory = response.data
            }
        });
    };

    $scope.createCategory = function(){
        if($scope.category.mainCategory == "Loisir"){
           $scope.category.name = "Loisir - " + $scope.category.name; 
        }
        if($scope.category.mainCategory == "Restaurant"){
           $scope.category.name = "Food - " + $scope.category.name; 
        }
        $http.post(API_ENDPOINT.url + '/api/categories/create',$scope.category).success(function(response){
            if(response.success == true){
                getListCategory();
                $scope.category = "";
            }
        });
    }   

    $scope.updateCategory = function(){
        $scope.isClickEdit = false;
        $http.put(API_ENDPOINT.url + '/api/categories/update/' + $scope.category._id,$scope.category).success(function(response){
            if(response.success == true){
                getListCategory();
                $scope.category = "";
            }
        });
    }   

    $scope.getCategory = function(id){
        $scope.isClickEdit = true;
        $http.get(API_ENDPOINT.url + '/api/categories/get/' + id).success(function(response){
            if(response.success == true){
                $scope.category = response.data;
            }
        });
    }   

    
    /**--------------------- */
    /**Start Service Function */
    /**--------------------- */
     var getListCategoryServices = function(){
         $scope.listCategoryService = [];
         $http.get(API_ENDPOINT.url + '/api/categories/getList').success(function(response){
            for(var item in response.data){
                if(response.data[item].mainCategory != "Restaurant"){
                    $scope.listCategoryService.push(response.data[item]);
                }
            }
        });
    };

    var getNameAddress = function(){
        return $q(function(resolve,reject){
            $http.get("jslib/config/countryVN.json").then(function(data){
                var nameStreet = $scope.service.housenumber + " " + $scope.service.street;
                var nameCity = data.data.city[$scope.service.city.id - 1].name;
                var nameDistrict = data.data.city[$scope.service.city.id - 1].Quan[$scope.service.district.id - 1].name;
                var address = {
                    street : nameStreet,
                    district : nameDistrict,
                    city : nameCity,
                    fullName : nameStreet + ", " + nameDistrict + ", " + nameCity,
                    queryName : $scope.service.street + ", " + nameDistrict + ", " + nameCity
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
        $scope.saveService = {
            service_name : $scope.service.service_name,
            service_desciption : $scope.service.description,
            category : $scope.service.category,
            housenumber : $scope.service.housenumber,
            street : $scope.service.street,
            district : $scope.oldAddress.district,
            city :  $scope.oldAddress.city,
            longitude : $scope.mapPosition.lng,
            latitude : $scope.mapPosition.lat,
            photo1 :  $scope.service.photo1,
            photo2 :  $scope.service.photo2,
            photo3 :  $scope.service.photo3,
            photo4 :  $scope.service.photo4,
            photo5 :  $scope.service.photo5
        }
        if($scope.isEditService){
            $http.put(API_ENDPOINT.url + '/api/services/updateinfo/' + $scope.service._id,$scope.saveService).success(function(data){
                toaster.pop('success',"Status",data.msg);
                $scope.loadService();
            });    
        }else{
        $http.post(API_ENDPOINT.url + '/api/services/create',$scope.saveService).success(function(data){
            if(data.success){
                    toaster.pop('success',"Status",data.msg);
                    loadService();
                    $scope.service = null;
                }
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
                if(data.data.city[i].id == $scope.service.city.id){
                        $scope.districts = data.data.city[i].Quan   
                }
            }
        })    
    }

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

    var loadService = function(){
         $http.get(API_ENDPOINT.url + '/api/services/findall/').success(function(data){
                $scope.listService = data.data;
        }); 
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
    $scope.deleteService = function(idserv){
        for(var i in $scope.listService){
            if($scope.listService[i]._id == idserv){
                $scope.listService.splice(i,1);
            }
        }
        $http.delete(API_ENDPOINT.url + '/api/services/deleteservice/' + idserv).success(function(data){
           toaster.pop('error',"Status",data.msg);
        });    
    }
    /**--------------------- */
    /**End Service Function */
    /**--------------------- */
    getListCategoryServices();
    loadService();
    loadCity();
    getListPublicity();
    getListOder();
    getListFood();
    getListCategory();

})