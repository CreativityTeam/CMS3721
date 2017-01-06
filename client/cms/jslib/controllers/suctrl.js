var suctrl = angular.module("suctrl",[]);

suctrl.controller("sucontroller", function($scope,$http,AuthService,API_ENDPOINT,toaster){
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
    getListPublicity();
    getListService();
    getListOder();
    getListFood();

})