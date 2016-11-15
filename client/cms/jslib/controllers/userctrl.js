var userctrl = angular.module("userctrl",[]);

userctrl.controller("usercontroller",function($scope,$http,AuthService,API_ENDPOINT,toaster){
    $scope.searchName = "";
    $scope.map = "map.html";
     var getinfo = function(){
        if(AuthService.isAuthenticated()){
                $scope.loading = true;
                $http.get(API_ENDPOINT.url + '/api/users/findone/' + AuthService.tokensave()).success(function(response){
                if(response.success){
                    $scope.user = response.data;
                    $scope.loading = false;
                }
            });
        }
    };

    var getAllUser = function(){
         $http.get(API_ENDPOINT.url + '/api/users/findUserAll').success(function(response){
            $scope.loading = true;
            if(response.success){
                    $scope.userList = response.data;
                    $scope.loading = false;
                }    
         });
    };

    $scope.deselect = function() {
        $scope.newUser = "";
    }

    $scope.edit = function(id) {
         $http.get(API_ENDPOINT.url + '/api/users/findUserID/' + id).success(function(response){
            $scope.loading = true;
            if(response.success){
                    $scope.newUser = response.data;
                    $scope.loading = false;
            }    
         });
    }

    $scope.updateRole = function() {
        $http.put(API_ENDPOINT.url + '/api/users/changeRole/' + $scope.newUser._id ,$scope.newUser).success(function(response){
            $scope.loading = true;
            if(response.success){
                getAllUser();
                toaster.pop('success',"Update Status",response.msg);
                $scope.loading = false;
            }    
         });    
    };

    $scope.updateUser = function(id) {
        $http.put(API_ENDPOINT.url + '/api/users/update/' + id, $scope.user).success(function(response){
            $scope.loading = true;
            if(response.success){
                getinfo();
                toaster.pop('success',"Update Status",response.msg);
                $scope.loading = false;
            }    
         });      
    };

    getAllUser();
    getinfo();  
});