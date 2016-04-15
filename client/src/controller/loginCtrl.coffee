tableau
.controller 'loginCtrl', ($scope, $http, jwtHelper, store, auth, $location, SweetAlert, alertFct, $mdDialog, ipFct) ->

    # $scope.test =
    #   closeEl: '.close'
    #   modal:
    #     templateUrl: 'modals/loading.html'
    #     controller:   'loadingCtrl'

    $scope.login = (user, ev) ->
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
                username: user.username
                password: user.password
            }
        .success (data) ->
            ipFct.insertDataIp("login session")
            $mdDialog.hide()
            store.set('JWT', data.token)
            $location.path "/home"
        .error (err) ->
            alertFct.loginError()
            $mdDialog.hide()
