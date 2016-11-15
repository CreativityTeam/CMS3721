var auth = angular.module('auth',[
    'globalvar',
    'authservice',
    'toaster',
    'ngAnimate'
]);

auth.directive('loading',function(){
    return {
        restrict : "E",
        replace : true,
        template: '<div class="loading"><img src="/assets/img/loading.gif" width="20" height="20" /> Please Wait A Few Minutes...</div>',
        link : function(scope,element,attr){
            scope.$watch('loading',function(val){
                if(val){
                    $(element).show();
                }else{
                    $(element).hide();
                }
            });
        }
    }
});

auth.controller('logincontroller',function($scope,$http,$window,AuthService,API_ENDPOINT,toaster){
    var checkconnection = function(){
        $http.get(API_ENDPOINT.url + '/checkconnection').success(function(response){
            if (response.status == 200){
                $scope.isHide = true;   
            }else{
                $scope.isHide = false;   
            }
        });
    }
    checkconnection();
    $scope.login = function(){
        $scope.loading = true;
        AuthService.login($scope.user).then(function(msg){
            $window.location.href = "/";   
        },function(errMsg){
            $scope.loading = false;
            toaster.pop('error',"Login Exception",errMsg)
        });
    };
    $scope.register = function(){
        $scope.loading = true;
        AuthService.register($scope.newUser).then(function(msg){
            $window.location.href = "/";   
        },function(errMsg){
            $scope.loading = false;
            toaster.pop('error',"Register Exception",errMsg)
        });
    };
    $scope.loginFacebook = function(){
        FB.login(function (response) {
            if (response.authResponse) {
                FB.api('/me?fields=id,name,gender,email,picture', function (response) {
                    $http.post(API_ENDPOINT.url + '/api/users/createFace', response).success(function(response){
                        if(response.success){
                            AuthService.setToken(response.token);
                            $window.location.href = "/";
                        }
                    });
                });
            } else {
                console.log('User cancelled login or did not fully authorize.');
            }
        });
    };
});

window.fbAsyncInit = function() {
    FB.init({
      appId      : '1870764956543057',
      xfbml      : true,
      version    : 'v2.8'
    });
  };
(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));