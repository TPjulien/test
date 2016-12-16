'use strict'

tableau = angular.module 'tableauApp', [
  'ngSanitize'
  'ngMaterial'
  'ngAria'
  'ngAnimate'
  'oitozero.ngSweetAlert'
  'ngFileUpload'
  'ui.router'
  'angular-jwt'
  'angular-storage'
  'auth0'
  'ui.bootstrap'
  'ngMessages'
  'anim-in-out'
  'ngTable'
  'md.data.table'
  'smDateTimeRangePicker'
  'vAccordion'
  'wysiwyg.module'
  'colorpicker.module'
  'ngMap'
]

options = {}
options.api = {}
# dev
# options.api.base_url = "http://151.80.121.123:3001/api"

# pré-prod
options.api.base_url = "https://api.test.tp-control.travelplanet.fr"

# pour la base2
getBase2 = ->
    result = []
    base   = 32
    i      = 0
    while i < 32
      result.push 2**i
      i++
    return result

getResultBase2 = getBase2()

# prod
# options.api.base_url = "https://api.tp-control.travelplanet.fr"

tableau
.config (authProvider, $stateProvider, $urlRouterProvider, $httpProvider, jwtInterceptorProvider, $mdThemingProvider, pickerProvider) ->

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
    $urlRouterProvider.otherwise '/login'
    $stateProvider
        .state 'login',
            url:         '/login',
            templateUrl: 'templates/login.html',
            controller:  'loginCtrl'
        # la partie saml
        .state 'saml',
            url:         '/SAML/:tokenSaml',
            templateUrl: 'templates/samlCheck.html',
            controller:  'samlCtrl'
        # Pour la gallerie d'images
        .state 'gallery',
            url:         '/gallery',
            templateUrl: 'templates/gallery.html',
            controller:  'galleryCtrl'
        # pour recuperer l'image
        .state 'getImage',
            url:         '/img/:filename',
            templateUrl: 'templates/img.html',
            controller:  'imgCtrl'
        .state 'login.account',
            url:         '/account',
            templateUrl: 'templates/loginVerify.html'
            controller:  'loginVerifyCtrl'
        .state 'login.checkaccount',
            url:         '/verify/:Login/:SITE_ID'
            templateUrl: 'templates/accountVerify.html'
            controller:  'accountVerifyCtrl'
        .state 'login.comunity',
            url:         '/comunity'
            templateUrl: 'templates/comunityList.html'
            params : { username : null },
            controller:   'communityCtrl'
        .state 'home',
            url:         '/home',
            templateUrl: 'templates/home.html',
            controller:  'homeCtrl'
        .state 'home.test',
            url:          '/dashboard',
            controller:   'iterativeLayoutCtrl',
            params: { embeds : null },
            templateUrl:  'templates/iterativeLayout.html'
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
