tableau
.controller 'loginCtrl', ($scope, $http, jwtHelper, store, auth, $location, SweetAlert, alertFct) ->

    $scope.login = (user) ->
        $http
            method: 'POST'
            url:    options.api.base_url + '/login'
            data: {
                username: user.username
                password: user.password
            }
        .success (data) ->
            store.set('JWT', data.token)
            $location.path "/home/test"
        .error (err) ->
            alertFct.loginError()
