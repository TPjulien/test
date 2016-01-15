tableau
.controller 'loginCtrl', ($scope, $location, $http, jwtHelper) ->

    $scope.login = (user) ->
        # console.log user
        # $location.path "/home"
        $http
            method: 'POST'
            url:    options.api.base_url + '/login'
            data: {
                username: user.username
                password: user.password
            }
        .success (data) ->
            token = data.token
            tokenPayload = jwtHelper.decodeToken(token)
            console.log tokenPayload
        .error (err) ->
            console.log err
        # console.log "Bonjour, la page de login !"
