var app = angular.module('cms',[
    'ui.router',
    'mainroute',
    'globalvar',
    'authservice',
    'defaultctrl',
    'userctrl',
    'photoctrl',
    'toaster'
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