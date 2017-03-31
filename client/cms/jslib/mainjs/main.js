var app = angular.module('cms',[
    'ui.router',
    'mainroute',
    'globalvar',
    'appservice',
    'defaultctrl',
    'userctrl',
    'photoctrl',
    'dashboardctrl',
    'resctrl',
    'toaster',
    'ngMap',
    'suctrl',
    'ngFileUpload',
    'notificationctrl'
]);

app.directive('loading',function(){
    return {
        restrict : "E",
        replace : true,
        template: '<div class="loading"><img src="/assets/img/loading.gif" width="20" height="20" /> Updating Information....</div>',
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