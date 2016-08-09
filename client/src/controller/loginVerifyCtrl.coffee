tableau
.controller 'loginVerifyCtrl', ($http, $location, $scope, $mdDialog, store, jwtHelper) ->

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
            url:    options.api.base_url + '/loginProfils/' + $scope.username
        .success (data) ->
            if (data.length == 1)
                $location.path '/login/verify/' + $scope.username
            else if (data.length > 1)
                $location.path '/login/comunity/' + $scope.username
        .error (err) ->
            # ajouter un toas en cas d'erreur
            console.log err
