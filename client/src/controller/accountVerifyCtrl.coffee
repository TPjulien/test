tableau
.controller 'accountVerifyCtrl', ($scope, $location, $stateParams, $mdDialog, $http, ipFct, store, auth, jwtHelper, alertFct) ->

    community   = $stateParams.community
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
    $scope.backToCommu = () ->
        store.remove 'JWT'
        $location.path "/login/account"

    $scope.user_image_url       = '/img/user_account.png'
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
            store.set('JWT', data.token)
            $location.path "/home"
        .error (err) ->
            alertFct.loginError()
            $mdDialog.hide()
