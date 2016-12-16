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
        $http
            method: 'GET'
            url:    options.api.base_url + '/loginCheck/' + $scope.username
        .success (data) ->
            console.log data
            if (data.tpa)
                if (data.tpa.length == 1)
                    # if (data.saml[0].SAML_TYPE == "0" or data.saml[0].SAML_TYPE == null)
                    #     $location.path '/login/verify/' + $scope.username + '/' + data.tpa[0].SITE_ID
                    if (data.saml[0].SAML_TYPE == "RENATER")
                        $window.location.href = "https://api.tp-control.travelplanet.fr/shibboleth/" + $scope.username
                    else
                        $state.go 'login.comunity', { username : $scope.username }
            else if (data.length > 0)
                $state.go 'login.comunity', { username : $scope.username }
            else
                toastErrorFct.toastError("L'utilisateur : " + $scope.username + " n'existe pas")
        .error (err) ->
            toastErrorFct.toastError("Impossible de se connecter au serveur de login, veuillez retenter plus tard")
