tableau
.controller 'loginVerifyCtrl', ($http, $location, $scope, $mdDialog, store, jwtHelper, toastErrorFct) ->

    if store.get('JWT')
      token           = store.get('JWT')
      decode          = jwtHelper.decodeToken(token)
      $scope.get_username = decode[0].username
      $location.path '/login/verify/' + $scope.get_username

    $scope.background_image_url = '/img/default_account_wallpaper.jpg'
    $scope.user_image_url       = '/img/travel_planet_logo.png'

    $scope.stepVerify = (ev) ->
        console.log "step !"
        $http
            method: 'POST'
            url:    options.api.base_url + '/loginProfils'
            data:
                username: $scope.username
        .success (data) ->
            console.log data
            console.log "ça fonctionne !"
            $window.open(data, "_blank")
            # console.log data
            if (data.length == 1)
                $location.path '/login/verify/' + $scope.username
            else if (data.length > 1)
                $location.path '/login/comunity/' + $scope.username
            else
                toastErrorFct.toastError("L'utilisateur : " + $scope.username + " n'existe pas")
        .error (err) ->
            toastErrorFct.toastError("Impossible de se connecter au serveur de login, veuillez retenter plus tard")
