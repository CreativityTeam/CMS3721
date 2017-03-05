var suctrl = angular.module("suctrl",[]);

suctrl.controller("sucontroller", function($q,$scope,$http,AuthService,API_ENDPOINT,toaster,Upload){
    $scope.isvalidateadd = true;
    $scope.isfilledAdd = false;
    var listPhoto = [];
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
        return new Promise(function(resolve,reject){
            var addressValid;
            $http.get("jslib/config/countryData.json").then(function(data){
                    angular.forEach(data.data,function(value){
                        if(value.Code == $scope.service.country.id){
                            var nameCountry = value.Country;
                            var nameStreet = $scope.service.housenumber + " " + $scope.service.street;
                            var nameCity = $scope.service.city.id;
                            addressValid = {
                                street : nameStreet,
                                country : nameCountry,
                                city : nameCity,
                                fullName : nameStreet + ", " + nameCity + ", " + nameCountry
                            }
                            resolve(addressValid);
                        }
                    })
            })
        }); 
    }

    /**Check Address */
    $scope.validateadd= function(){
        getNameAddress().then(function(dataAddress){
            $http.get("https://maps.googleapis.com/maps/api/geocode/json?v=3.27&address=" + dataAddress.country + dataAddress.city + "&key=AIzaSyCtZg8ZpyEFjRqin6kdAvckjKAT7M-hd_g").success(function(response){
                initmap(response,dataAddress);
            }); 
        })
        $scope.isvalidateadd = false;
        $scope.isfilledAdd = true; 
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
    
    $scope.uploadFiles = function(files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        angular.forEach(files, function(file) {
            file.upload = Upload.upload({
                url:  API_ENDPOINT.url + '/api/photos/addphoto',
                data: {file: file}
            });

            file.upload.then(function (response) {
                listPhoto.push(API_ENDPOINT.urlHost + response.data.data.url)
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
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
            timeopen : $scope.service.timeopen,
            codesiret : $scope.service.codesiret,
            postalCode :$scope.service.postalCode,
            country : $scope.oldAddress.country,
            photo1 :  listPhoto[0],
            photo2 :  listPhoto[1],
            photo3 :  listPhoto[2],
            photo4 :  listPhoto[3],
            photo5 :  listPhoto[4],
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
    var loadCountry = function(){
        $http.get("jslib/config/countryData.json").then(function(data){
            $scope.countries = data.data;
        })
    }

    $scope.loadCity = function(){
        $http.get("https://api.zippopotam.us/" + $scope.service.country.id + "/" + $scope.service.postalCode).then(function(data){
            $scope.cities = data.data.places;
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
    loadCountry();
    getListPublicity();
    getListOder();
    getListFood();
    getListCategory();

})