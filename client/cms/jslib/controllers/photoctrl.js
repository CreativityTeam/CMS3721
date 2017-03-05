var photoctrl = angular.module("photoctrl",[]);

photoctrl.controller("photoController", function($scope,$http,AuthService,API_ENDPOINT,toaster,Upload){

    $scope.searchPhoto = "";
    $scope.uploadPhoto = function(file){
        file.upload = Upload.upload({
            url: API_ENDPOINT.url + '/api/photos/addphoto',
            data: {file: file},
        });
        getPhotoByUser();
    };

    var getCurrentUser = function(){
        $http.get(API_ENDPOINT.url + '/api/users/findone/' + AuthService.tokensave()).success(function(response){
            if(response.success){
                $scope.user = response.data;
            }
        });
    } 

    var getPhotoByUser = function(){
        $http.get(API_ENDPOINT.url + '/api/photos/findPhotoUser/' + AuthService.tokensave()).success(function(response){
            if(response.success){
                $scope.photoList = response.data;
            }
        });    
    }

    $scope.remove = function(id){
        $http.delete(API_ENDPOINT.url + '/api/photos/removephoto/' + id).success(function(response){
            if(response.success){
                getPhotoByUser();
                toaster.pop('success',"Remove Status",response.msg);
            }
        });    
    };

    getPhotoByUser();
    getCurrentUser();   
});