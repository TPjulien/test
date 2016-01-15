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
  'ngDialog'
  'angular-jwt'
]

options = {}
options.api = {}
options.api.base_url = "http://127.0.0.1:3000/api"

tableau
.config ($stateProvider, $urlRouterProvider, $httpProvider) ->
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
    # $httpProvider.defaults.headers.common = {}
    # $httpProvider.defaults.headers.post   = {}
    # $httpProvider.defaults.headers.put    = {}
    # $httpProvider.defaults.headers.patch  = {}
