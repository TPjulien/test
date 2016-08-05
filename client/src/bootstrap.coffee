'use strict'

tableau = angular.module 'tableauApp', [
  'ngSanitize'
  'ngMaterial'
  'ngAria'
  'ngAnimate'
  'lumx'
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
  'ui.bootstrap'
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
  'ngImageCache'
  'ngTable'
  'md.data.table'
  'ngMaterialDatePicker'
]

options = {}
options.api = {}
# dev
options.api.base_url = "http://151.80.121.123:3001/api"

# prod
# options.api.base_url = "https://tp-control.travelplanet.fr:3254/api"
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
            url:         '/verify/:Login/:SITE_ID'
            templateUrl: 'templates/accountVerify.html'
            controller:  'accountVerifyCtrl'
        .state 'login.comunity',
            url:         '/comunity/:username'
            templateUrl: 'templates/comunityList.html'
            controller:   'communityCtrl'
        .state 'home',
            url:         '/home',
            templateUrl: 'templates/home.html',
            controller:  'homeCtrl'
        .state 'home.test',
            url:          '/dashboard/:client/:id/:embed/:list',
            templateUrl:  'templates/iterativeLayout.html',
            controller:   'iterativeLayoutCtrl'
        .state 'home.list',
            url:          '/tableau/:site_id/:view_id/:embed_id'
            templateUrl:  'templates/toto.html',
            controller:   'listTableauCtrl'
        .state 'home.error',
            url:          '/error',
            templateUrl:  'templates/error.html',
            constroller:  'errorCtrl'
        .state 'home.test.facture',
            url:          '/factures',
            templateUrl:  'templates/datatable.html',
            controller:   'datatableCtrl'
        .state 'home.profil',
            url:          '/profil',
            templateUrl:  'templates/profil.html',
            controller:   'profilCtrl'
    jwtInterceptorProvider.tokenGetter = [
      'store'
      '$http'
      (store, $http) ->
        store.get('JWT')
    ]
    $httpProvider.interceptors.push 'jwtInterceptor'
    # $httpProvider.defaults.withCredentials = true
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
