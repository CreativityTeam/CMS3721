var appservice = angular.module('appservice',[]);

appservice.service('AuthService',function($q, $http,API_ENDPOINT){
    var token_local = "Create Toke Pls";
    var isAuthenticated = false;
    var authToken;

    var useToken = function(token){
        isAuthenticated = true;
        authToken = token;
    };

    var storeToken = function(token){
        window.localStorage.setItem(token_local,token);
        useToken(token);
    };

    var destroyToken = function(){
        authToken = undefined;
        isAuthenticated = false;
        window.localStorage.removeItem(token_local);
    };

    var register = function(user){
        return $q(function(resolve,reject){
            $http.post(API_ENDPOINT.url + '/api/users/register' , user).then(function(response){
                if(response.data.success){
                    storeToken(response.data.token);
                    resolve(response.data.msg);
                }else{
                    reject(response.data.msg);
                }
            });
        });
    };

    var login = function(user){
        return $q(function(resolve,reject){
            $http.post(API_ENDPOINT.url + '/api/users/login' , user).then(function(response){
                if(response.data.success){
                    storeToken(response.data.token);
                    resolve(response.data.msg);
                }else{
                    reject(response.data.msg);
                }
            });  
        })
    };

    var checkToken = function(){
        var token = window.localStorage.getItem(token_local);
        if(token){
            useToken(token);
        }
    };

    checkToken();
    
    var logout = function(){
        destroyToken();
    };

  return {
    login: login,
    register: register,
    logout: logout,
    setToken : function(token) { return storeToken(token);},
    tokensave : function() {return authToken;},
    isAuthenticated: function() {return isAuthenticated;}
  };
});

appservice.service('checkConnection',function($q, $http,API_ENDPOINT){
    this.check = function(){
        var async = $q.defer();
        $http.get(API_ENDPOINT.url + '/checkconnections').then(function(response){
            if(response.status == 200){
                async.resolve(response.status);
            }else{
                async.reject(response.status);         
            }
        });
        return async.promise;
        /*return $q(function(resolve,reject){
            $http.get(API_ENDPOINT.url + '/checkconnection').then(function(response){
                if (response.status == 200){
                    resolve(response.status); 
                }else{
                    reject(response.status);    
                }
            });
        })*/
    };
});
