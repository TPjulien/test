tableau
.controller 'accountVerifyCtrl', ($scope, $location, $stateParams, $mdDialog, $http, ipFct, store, auth, jwtHelper, alertFct) ->

    $scope.name                 = $stateParams.username
    SITE_ID                     = $stateParams.SITE_ID
    Login                       = $stateParams.Login
    $scope.user_image_url       = '/img/user_account.png'
    $scope.background_image_url = '/img/wallpaper_account.jpg'
    $scope.data                 = []

    verifyAccount = ->
        $http
          method: 'POST'
          url:    options.api.base_url + '/verify/' + Login + '/' + SITE_ID
          data:
              SITE_ID: SITE_ID
              username: Login
        .success (data) ->
            $mdDialog.hide()
            $scope.data = data
        .error (err) ->
            alertFct.loginError()
            $mdDialog.hide()
            $location.path "/login/account"

    verifyAccount()

    $scope.backToCommu = () ->
        store.remove 'JWT'
        $location.path "/login/account"

    $scope.login = (ev) ->
        $mdDialog.show
          controller          : 'loadingCtrl'
          templateUrl         : 'modals/loading.html'
          parent              : angular.element(document.body)
          targetEvent         : ev
          clickOutsideToClose : false
          escapeToClose       : false


        $http
            method: 'POST'
            url:    options.api.base_url + '/login'
            data: {
                SITE_ID  : SITE_ID
                username : Login
                password : $scope.password
            }
        .success (data) ->
            store.set('JWT', data.token)
            if store.get 'JWT'
                get_action = "Logged with click"
                ipFct.insertDataIp(get_action)
            $location.path "/home"
        .error (err) ->
            alertFct.loginError()
            $mdDialog.hide()
