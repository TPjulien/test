tableau
.controller 'accountVerifyCtrl', ($scope, $location, $stateParams, $mdDialog, $http, ipFct, store, auth, jwtHelper, alertFct) ->
    username    = $stateParams.username
    $scope.data = []
    $http
      method: 'POST'
      url:    options.api.base_url + '/verify'
      data:
          username: username
    .success (data) ->
        $mdDialog.hide()
        $scope.data = data
    .error (err) ->
        alertFct.loginError()
        $mdDialog.hide()
        $location.path "/login/account"

    $scope.name = $stateParams.username
    $scope.backtoLoggin = () ->
        store.remove 'JWT'
        $location.path "/login/account"

    $scope.user_image_url       = '/img/user_account.png'
    # $scope.user_image_url = 'https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/3/005/082/37d/3e8b4a2.jpg'
    $scope.background_image_url = '/img/wallpaper_account.jpg'

    $scope.login = (ev) ->
        $mdDialog.show
          controller:          'loadingCtrl'
          templateUrl:         'modals/loading.html'
          parent:              angular.element(document.body)
          targetEvent:         ev
          clickOutsideToClose: false
          escapeToClose:       false
        $http
            method: 'POST'
            url:    options.api.base_url + '/login'
            data: {
                username: username
                password: $scope.password
            }
        .success (data) ->
            $mdDialog.hide()
            ipFct.insertDataIp("Login session")
            store.set('JWT', data.token)
            $location.path "/home"
        .error (err) ->
            alertFct.loginError()
            $mdDialog.hide()
