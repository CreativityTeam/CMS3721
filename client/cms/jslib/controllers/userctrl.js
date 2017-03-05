var userctrl = angular.module("userctrl",[]);

userctrl.controller("usercontroller",function($scope,$http,AuthService,API_ENDPOINT,toaster,NgMap,NavigatorGeolocation,Upload,$timeout){
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

    $scope.updateUser = function(id,file) {
        if(!file){
            $http.put(API_ENDPOINT.url + '/api/users/update/' + id, $scope.user).success(function(response){
                $scope.loading = true;
                if(response.success){
                    getinfo();
                    toaster.pop('success',"Update Status",response.msg);
                    $scope.loading = false;
                }    
             });     
        }else{
            file.upload = Upload.upload({
                url: API_ENDPOINT.url + '/api/photos/addphoto',
                data: {file: file},
            });
            file.upload.then(function (response) {
                    $scope.user.avatar = API_ENDPOINT.urlHost + response.data.data.url;
                    $http.put(API_ENDPOINT.url + '/api/users/update/' + id, $scope.user).success(function(response){
                        $scope.loading = true;
                        if(response.success){
                            getinfo();
                            toaster.pop('success',"Update Status",response.msg);
                            $scope.loading = false;
                        }    
                    });    
                }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }); 
        } 
    };

    var getUserCurrentLocation = function(){
        NavigatorGeolocation.getCurrentPosition().then(function(position) {
            $scope.lat = position.coords.latitude;
            $scope.lng = position.coords.longitude;
        });
    }

    getUserCurrentLocation()
    getAllUser();
    getinfo();  
});