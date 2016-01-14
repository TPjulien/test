'use strict'

tableau = angular.module 'tableauApp', [
  'ngSanitize'
  'ngMaterial'
  'ngAria'
  'ngAnimate'
  'oitozero.ngSweetAlert'
  'ngCookies'
  'mdPickers'
  'md.data.table'
  'angular-md5'
  'ngFileUpload'
  'ui.router'
]

tableau
.config ($stateProvider, $urlRouterProvider) ->
    $urlRouterProvider.otherwise '/login'

    $stateProvider
        .state 'login',
            url:         '/login',
            templateUrl: 'templates/login.html',
            controller:  'loginCtrl'
        .state 'home',
            url:         '/home',
            templateUrl: 'templates/home.html',
            controller:  'homeCtrl'
        .state 'home.test',
            url:          '/test',
            templateUrl:  'templates/test.html',
            controller:   'testCtrl'
