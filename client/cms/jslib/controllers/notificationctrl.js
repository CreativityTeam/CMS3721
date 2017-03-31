const notificationctrl = angular.module('notificationctrl',[]);

notificationctrl.controller('notificationController',function($scope,$http,API_ENDPOINT){
    const getAllNotification = () =>{
        $http.get(API_ENDPOINT.url + '/api/notifications/getAllNotification')
            .then(function(responseSuccess){
                $scope.listNotification = responseSuccess.data.allNotification;
            },function(responseFail){
                console.log(responseFail);
            });
    };
    getAllNotification();
});