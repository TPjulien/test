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
  'angular-storage'
  'auth0'
]

options = {}
options.api = {}
options.api.base_url = "http://151.80.121.113:3000/api"

tableau
.config (authProvider, $stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider) ->
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
    jwtInterceptorProvider.tokenGetter = [
      'store'
      '$http'
      (store, $http) ->
        store.get('JWT')
    ]
    $httpProvider.interceptors.push 'jwtInterceptor'
.run ($rootScope, jwtHelper, $location, store, alertFct) ->
    $rootScope.$on '$locationChangeStart', ->
        token = store.get('JWT')
        if token
            if !jwtHelper.isTokenExpired(token)
            else
                alertFct.alertExpiration()
                $location.path '/login'
        else
            if $location.path() == '/login'
                console.log("on est dans login !")
            else
                alertFct.tokenNotFound()
                $location.path '/login'
