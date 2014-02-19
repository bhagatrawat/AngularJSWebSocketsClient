/*######################################################################################
  Desc: Application Router, it will be useful in future when you have multiple pages.
  @Author: Bhagat Singh
   AngularJSWebSocketsClient Application's folder structure
  /app
      /controllers      
      /directives
      /services
      /views
 ####################################################################################*/

 var consoleApp = angular.module('gluConsoleExt', ['ngRoute','ngResource']);

//This configures the routes and associates each route with a view and a controller
consoleApp.config(function ($routeProvider) {
    $routeProvider
        //Route to Dashboard
        .when('/applications/',
            {
                controller: 'ApplicationsController',
                templateUrl: '/AngularJSWebSocketsClient/app/views/dashboard.html'
            })
        //Route to About tab
        .when('/about/',
            {
                controller: 'AboutController',
                templateUrl: '/AngularJSWebSocketsClient/app/views/about.html'
            })
         //if None of the above then route to Dashboard
        .otherwise({ redirectTo: '/applications/' });
});
