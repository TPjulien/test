tableau
.controller 'loginVerifyCtrl', ($http, $location, $scope, $mdDialog, store, jwtHelper, toastErrorFct, $window) ->

    if store.get('JWT')
      token           = store.get('JWT')
      decode          = jwtHelper.decodeToken(token)
      $scope.get_username = decode[0].username
      $location.path '/login/verify/' + $scope.get_username

    # $window.location.href = "https://tp-control.travelplanet.fr:3254/api/shibboleth"

    $scope.background_image_url = '/img/default_account_wallpaper.jpg'
    $scope.user_image_url       = '/img/travel_planet_logo.png'

    $scope.stepVerify = (ev) ->
        $http
            method: 'GET'
            url:    options.api.base_url + '/loginCheck/' + $scope.username
        .success (data) ->
            if (data.length == 1)
                $location.path '/login/verify/' + $scope.username + '/' + data[0].SITE_ID
            else if (data.length > 1)
                $location.path '/login/comunity/' + $scope.username
            else
                toastErrorFct.toastError("L'utilisateur : " + $scope.username + " n'existe pas")
        .error (err) ->
            toastErrorFct.toastError("Impossible de se connecter au serveur de login, veuillez retenter plus tard")
