'use strict'

tableau = angular.module 'tableauApp', [
  'ngSanitize'
  'ngMaterial'
  'ngAria'
  'ngAnimate'
  'oitozero.ngSweetAlert'
  'ngCookies'
  'mdPickers'
  'angular-md5'
  'ngFileUpload'
  'ui.router'
  'ngDialog'
  'angular-jwt'
  'angular-storage'
  'auth0'
  'ui.bootstrap.contextMenu'
  'rzModule'
  'daterangepicker'
  'ngMessages'
  'obDateRangePicker'
  'ngMorph'
  'anim-in-out'
  '720kb.tooltips'
  'btford.markdown'
  'textAngular'
]

options = {}
options.api = {}
options.api.base_url = "https://tp-control.travelplanet.fr:3253/api"

tableau
.config (authProvider, $stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider) ->
    $urlRouterProvider.otherwise '/login/account'
    $stateProvider
        .state 'login',
            url:         '/login',
            templateUrl: 'templates/login.html',
            controller:  'loginCtrl'
        .state 'login.account',
            url:         '/account',
            templateUrl: 'templates/loginVerify.html'
            controller:  'loginVerifyCtrl'
        .state 'login.checkaccount',
            url:         '/verify/:username'
            templateUrl: 'templates/accountVerify.html'
            controller:  'accountVerifyCtrl'
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
            url:          '/factures',
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
    # $rootScope.$on '$locationChangeStart', ->
    #     token = store.get('JWT')
    #     if token
    #         if jwtHelper.isTokenExpired(token)
    #             alertFct.alertExpiration()
    #             $location.path '/login/account'
    #     else
    #         if $location.path() == '/login' or $location.path() == ''
    #             console.log("successful !")
    #         else
    #             alertFct.tokenNotFound()
    #             $location.path '/login/account'
