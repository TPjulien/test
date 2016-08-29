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
  'smDateTimeRangePicker'
  'ui.tree'
  'angular-popover'
  'ngPopover'
]

options = {}
options.api = {}
# dev
options.api.base_url = "http://151.80.121.123:3001/api"

# prod
# options.api.base_url = "https://tp-control.travelplanet.fr:3254/api"
tableau
.config (authProvider, $stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider, $mdThemingProvider, pickerProvider) ->
    # console.log pickerProvider.setRangeDefaultList()
    # redirect interceptors
    # $httpProvider.interceptors.push('redirectInterceptor')

    # Partie picker
    pickerProvider.setOkLabel 'Enregistrer'
    pickerProvider.setCancelLabel 'Fermer'
    # Overide du datepicker pour le mettre en français
    pickerProvider.setDayHeader 'shortName'
    # Semaine
    pickerProvider
    .setDaysNames [
      {
        'single': 'D'
        'shortName': 'Dim'
        'fullName':  'Dimanche'
      }
      {
        'single': 'L'
        'shortName': 'Lun'
        'fullName':  'Lundi'
      }
      {
        'single': 'M'
        'shortName': 'Mar'
        'fullName':  'Mardi'
      }
      {
        'single': 'M'
        'shortName': 'Mer'
        'fullName':  'Mercredi'
      }
      {
        'single': 'J'
        'shortName': 'Jeu'
        'fullName':  'Jeudi'
      }
      {
        'single': 'V'
        'shortName': 'Ven'
        'fullName':  'Vendredi'
      }
      {
        'single': 'S'
        'shortName': 'Sam'
        'fullName':  'Samedi'
      }
    ]
    # Date Range config
    pickerProvider
    .setDivider 'au'
    pickerProvider
    .setMonthNames [
      "Janvier"
      "Fevrier"
      "Mars"
      "Avril"
      "Mai"
      "Juin"
      "Juillet"
      "Août"
      "Septembre"
      "Novembre"
      "Decembre"
    ]
    pickerProvider
    .setRangeDefaultList [
        {
          label     : "Aujourd'hui"
          startDate : moment().startOf('day')
          endDate   : moment().endOf('day')
        }
        {
          label     : "7 derniers jours"
          startDate : moment().subtract(7, 'd')
          endDate   : moment()
        }
        {
          label     : "Ce mois-ci"
          startDate : moment().startOf('month')
          endDate   : moment().endOf('month')
          # startDate : moment().startOf('month')
        	# endDate   : moment().endOf('month')
        }
        {
          label     : "Mois Dernier"
          startDate : moment().subtract(1, 'month').startOf('month')
          endDate   : moment()
          # startDate : moment().subtract(1,'month').startOf('month')
				  # endDate   : moment()
        }
        {
          label     : "Les 3 derniers mois"
          startDate : moment().subtract('quarter')
          endDate   : moment().endOf('quarter')
          # startDate : moment().startOf('quarter')
        	# endDate   : moment().endOf('quarter')
        }
        {
          label     : "Jusqu'a aujourd'hui"
          startDate : moment().startOf('year')
          endDate   : moment()
          # startDate :  moment().startOf('year')
        	# endDate   :  moment()
        }
        {
          label     : "cette année"
          startDate : moment().startOf('year')
          endDate   : moment().endOf('year')
          # startDate :  moment().startOf('year')
        	# endDate   :  moment().endOf('year')
        }
        {
          label     : "Autre"
          startDate : 'custom'
          endDate   : 'custom'
          # startDate : 'custom'
  				# endDate   : 'custom'
        }
    ]
    pickerProvider
    .setRangeCustomStartEnd [
        "Date de début"
        "Date de fin"
    ]
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
            url:          '/dashboard/:id',
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
    $rootScope.data = []
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
