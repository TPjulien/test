tableau
.controller 'loginVerifyCtrl', ($http, $location, $scope, $mdDialog, store, jwtHelper) ->

    # token            = store.get('JWT')
    # decode           = jwtHelper.decodeToken(token)
    # console.log decode
    if store.get('JWT')
      token           = store.get('JWT')
      decode          = jwtHelper.decodeToken(token)
      $scope.get_username = decode[0].username
      $location.path '/login/verify/' + $scope.get_username

      # console.log $scope.firstname
    accounts = (login) ->

    $scope.background_image_url = '/img/default_account_wallpaper.jpg'
    $scope.user_image_url       = '/img/travel_planet_logo.png'
    $scope.stepVerify = (ev) ->
        console.log $scope.username
        # $mdDialog.show
        #   controller:          'loadingCtrl'
        #   templateUrl:         'modals/loading.html'
        #   parent:              angular.element(document.body)
        #   clickOutsideToClose: false
        #   escapeToClose:       false

        $http
            method: 'GET'
            url:    options.api.base_url + '/loginProfils/' + $scope.username
        .success (data) ->
            console.log data
            if (Object.keys(data).length == 1)
                $location.path '/login/verify/' + $scope.username
            else if (Object.keys(data).length > 1)
                $location.path '/login/comunity/' + $scope.username
        .error (err) ->
            console.log err
