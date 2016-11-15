var registerctrl = angular.module('registerctrl',[]);

loginctrl.controller('registercontroler',function($scope,$http){

    $scope.aleretinfo = function(){
        alert("This function is called from Login page");
    };
});