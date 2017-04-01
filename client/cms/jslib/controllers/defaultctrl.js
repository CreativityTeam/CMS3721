var defaultctrl = angular.module('defaultctrl',[]);

defaultctrl.controller("DefaultController",function($scope,$http,AuthService,$window,API_ENDPOINT,toaster){
    $scope.list = "";
    $scope.listNotificationDefault = [];
    $scope.isHide = {
        superUser : true,
        user : true,
        res : true,
        comment : true,
        food : true,
        order : true,
        message : true,
        public : true,
        service : true
    };
    var getinfo = function(){
        if(AuthService.isAuthenticated()){     
                $scope.name = AuthService.getCurrentUser().local.name;
                if(AuthService.getCurrentUser().role == "SuperUser"){
                    $scope.isHide.superUser = false;
                    $scope.list = "list";
                }
        }
    };

    const notifyMe = () => {
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
        else if (Notification.permission === "granted") {
            let options = {
                body: 'Your restaurant have new order',
                icon: "icon.jpg",
                dir : "ltr"
            };
            let notification = new Notification("CMS 3721 Notification",options);
        }
        else if (Notification.permission !== 'denied') {
            Notification.requestPermission(function (permission) {
                if (!('permission' in Notification)) {
                    Notification.permission = permission;
                }
                if (permission === "granted") {
                    let options = {
                        body: 'Your restaurant have new order',
                        icon: "icon.jpg",
                        dir : "ltr"
                    };
                    let notification = new Notification("CMS 3721 Notification",options);
                }
            });
        }
    };

    getinfo();

    const getAllNotification = () => {
        $http.get(API_ENDPOINT.url + '/api/notifications/getAllNotification').then(function(response){
            response.data.allNotification.forEach(function(notification){
               let isExist = 1;
               $scope.listNotificationDefault.forEach(function(value){
                   if(value._id === notification._id){
                       isExist = 0;
                   }
               });
               if(isExist === 1){
                   if(!notification.state) {
                       if(AuthService.getCurrentUser().role === "SuperUser"){
                           $scope.listNotificationDefault.push(notification);
                       }else{
                           $http.get(API_ENDPOINT.url + '/api/orders/findOrder/' + notification.idRelated).then(function (response) {
                               if (response.data.data.res_belong.user_id === AuthService.getCurrentUser()._id) {
                                   $scope.listNotificationDefault.push(notification);
                               }
                           });
                       }
                   }
               }
            });
        })
    };

    getAllNotification();

    const ioConnect = ()  => {
        let socketHost = API_ENDPOINT.urlHost;
        let connect = function (ns) {
            return io.connect(ns, {
                query: 'ns='+ns,
                resource: "socket.io"
            });
        };
        const ioConn = connect(socketHost);
        ioConn.on('newOderNotification', function(data){
            if(data){
                    getAllNotification();
                    notifyMe();
            }
        });
    };

    ioConnect();

    $scope.test = function(){
        let data = {
            _id : "58b14eff12c3d51c8c6eed27"
        };
        $http.post(API_ENDPOINT.url + '/api/notifications/createNewNotification',data).then(function(response){});
    };
    $scope.logout = function(){
        AuthService.logout();
        $window.location.href = "/";
    };

    $scope.manageuser = function(){
        $scope.isHide.user = $scope.isHide.user == true ? false : true ;   
    };
    $scope.managerestaurant = function(){
        $scope.isHide.res = $scope.isHide.res == true ? false : true ;   
    };
});