'use strict';
var tableau;

tableau = angular.module('tableauApp', ['ngSanitize', 'ngMaterial', 'ngAria', 'ngAnimate', 'oitozero.ngSweetAlert', 'ngCookies', 'mdPickers', 'md.data.table', 'angular-md5', 'ngFileUpload', 'ui.router']);

tableau.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
  return $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  }).state('home', {
    url: '/home',
    templateUrl: 'templates/home.html',
    controller: 'homeCtrl'
  }).state('home.test', {
    url: '/test',
    templateUrl: 'templates/test.html',
    controller: 'testCtrl'
  });
}]);

tableau.controller('homeCtrl', ["$scope", "$location", function($scope, $location) {
  return console.log("Bonjour, voici le home !");
}]);

tableau.controller('loginCtrl', ["$scope", "$location", function($scope, $location) {
  $scope.login = function() {
    return $location.path("/home");
  };
  return console.log("Bonjour, la page de login !");
}]);

tableau.controller('testCtrl', function() {
  return console.log("melangé avec home !");
});
