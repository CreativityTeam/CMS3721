var suctrl = angular.module("suctrl",[]);

suctrl.controller("sucontroller", function($scope,$http,AuthService,API_ENDPOINT,toaster){
    $scope.mainListCategory = [
        {
            name : 'Restaurant'
        },{
            name : 'Salon de thé, patisserie'
        },{
            name : 'Bar, KTV'
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
    var getListService = function(){
        $scope.listService = []
        $http.get(API_ENDPOINT.url + '/api/restaurants/getAllService').success(function(response){
            for(var item in response.data){
                if(response.data[item].services.length != 0){
                    $scope.listService.push({
                        res_name : response.data[item].res_name,
                        services : response.data[item].services
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

    getListPublicity();
    getListService();
    getListOder();
    getListFood();
    getListCategory();

})