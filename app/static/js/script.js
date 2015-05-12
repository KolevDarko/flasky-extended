'use strict';   // See note about 'use strict'; below

var myApp = angular.module('myApp', ['ngRoute',]);
myApp.config(['$routeProvider', function($routeProvider) {
         $routeProvider.
             when('/home', {
                 templateUrl: '../static/partials/home.html',
             }).
             when('/about', {
                 templateUrl: '../static/partials/about.html',
             });
         }]);
             // .
             // when('/login', {
             //     templateUrl: '../static/partials/login.html',
             //     controller: 'LoginController'
             // }).
             // when('/logout', {
             //     templateUrl: '../static/partials/home.html',
             //     controller: 'LogoutController'
             // }).
             // when('/signup', {
             //     templateUrl: '../static/partials/signup.html',
             //     controller: 'SignupController'
             // }).
             // when('/reports', {
             //     templateUrl: '../static/partials/reports.html',
             //     controller: 'ReportsController'
             // }).
             // .otherwise({
             //     redirectTo: '/ng'
             // });

// create the controller and inject Angular's $scope
myApp.controller('mainController', ['$scope', function($scope) {

    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
}]);