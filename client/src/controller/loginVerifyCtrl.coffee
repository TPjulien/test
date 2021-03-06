tableau
.controller 'loginVerifyCtrl', ($http, $location, $scope, $mdDialog, store, jwtHelper, toastErrorFct, $window, $state) ->

    if store.get('JWT')
        token           = store.get('JWT')
        decode          = jwtHelper.decodeToken(token)
        $scope.get_username = decode[0].username
        $location.path '/login/verify/' + $scope.get_username

    $scope.background_image_url = '/img/default_account_wallpaper.jpg'
    $scope.user_image_url       = '/img/travel_planet_logo.png'

    $scope.stepVerify = (ev) ->
        parameters =
          key_name  : "login"
          key_value : $scope.username.toLowerCase()
        $http.post options.api.base_url + '/sign/user_lookup/profils', { parameters: parameters, selected: "site_id, user_id" }
        .then (data) ->
            if (data.data.length == 0)
                toastErrorFct.toastError("L'utilisateur : " + $scope.username.toLowerCase() + " n'existe pas")
            else
                $state.go 'login.comunity', { data : data.data, username: $scope.username.toLowerCase() }
        .catch (err) ->
            toastErrorFct.toastError("Impossible de se connecter au serveur de login, veuillez retenter plus tard")
