tableau
.controller 'loginCtrl', ($scope, $http, jwtHelper, store, auth, $location, SweetAlert, alertFct, $mdDialog) ->

    $scope.test =
      closeEl: '.close'
      modal:
        templateUrl: 'modals/loading.html'

    $scope.showAdvanced = (ev) ->


    $scope.login = (user, ev) ->
        $mdDialog.show
          controller: null
          templateUrl: 'modals/loading.html'
          parent:  angular.element(document.body)
          targetEvent: ev
          clickOutsideToClose: false
          escapeToClose: false
        $http
            method: 'POST'
            url:    options.api.base_url + '/login'
            data: {
                username: user.username
                password: user.password
            }
        .success (data) ->
            $mdDialog.hide()
            store.set('JWT', data.token)
            $location.path "/home"
        .error (err) ->
            alertFct.loginError()
