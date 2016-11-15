var aboutctrl = angular.module('aboutctrl',[]);

aboutctrl.controller('aboutcontroller',function($scope,$http){

    $scope.alert = function(){
        alert("Alert is called from about page");
    };
});