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
            console.log "hello !"
            # store.set('JWT', data.token)
            #$location.path "/home"
        .error (err) ->
            alertFct.loginError()
