var photoctrl = angular.module("photoctrl",[]);

photoctrl.controller("photoController", function($scope,$http,AuthService,API_ENDPOINT,toaster){

    $scope.searchPhoto = "";
    $scope.uploadPhoto = function(){
        var file = $("#file")[0].files[0];
        if(file == undefined){
            toaster.pop('error',"Upload Exception","Please choose at least one file");    
        }else{
            $scope.loading = true;
            var formData = new FormData;
            formData.append('decription',$scope.photo.decription);
            formData.append('userid',$scope.user._id);
            formData.append('image',file);
            $http.post(API_ENDPOINT.url + '/api/photos/addphoto', formData,{
                transformRequest : angular.identity,
                headers : {
                    'Content-Type' : undefined
                }
            }).then(function(response){
                getPhotoByUser(); 
                toaster.pop('success',"Update Status",response.data.msg);
                $scope.loading = false;
            });
        }
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