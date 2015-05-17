// create the module and name it scotchApp
var myApp = angular.module('myApp', []);

// create the controller and inject Angular's $scope
myApp.controller('mainController', function($scope) {

    // create a message to display in our view
    $scope.message = 'Everyone come and see how good I look!';
});