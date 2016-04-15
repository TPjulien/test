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
  'infinite-scroll'
  'ui.bootstrap.contextMenu'
  'rzModule'
  'daterangepicker'
  'ngMessages'
  'obDateRangePicker'
  'ngMorph'
  'anim-in-out'
  'ngOnload'
  '720kb.tooltips'
]

angular.module('infinite-scroll').value('THROTTLE_MILLISECONDS', 2000)

options = {}
options.api = {}
options.api.base_url = "http://151.80.121.113:3000/api"

tableau
.config (authProvider, $stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider) ->
    $urlRouterProvider.otherwise '/home/error'
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
            url:          '/dashboard/:client/:id',
            templateUrl:  'templates/iterativeLayout.html',
            controller:   'iterativeLayoutCtrl'
        .state 'home.error',
            url:          '/error',
            templateUrl:  'templates/error.html',
            constroller:  'errorCtrl'
        .state 'home.test.facture',
            url:          '/Factures',
            templateUrl:  'templates/facture.html',
            controller:   'factureCtrl'
    jwtInterceptorProvider.tokenGetter = [
      'store'
      '$http'
      (store, $http) ->
        store.get('JWT')
    ]
    $httpProvider.interceptors.push 'jwtInterceptor'
.run ($rootScope, jwtHelper, $location, store, alertFct) ->
    $rootScope.color = "#03a9f4"
    $rootScope.$on '$locationChangeStart', ->
        token = store.get('JWT')
        if token
            if jwtHelper.isTokenExpired(token)
                alertFct.alertExpiration()
                $location.path '/login'
        else
            if $location.path() == '/login' or $location.path() == ''
                console.log("successful !")
            else
                alertFct.tokenNotFound()
                $location.path '/login'
