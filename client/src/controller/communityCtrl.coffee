tableau
.controller 'communityCtrl', ($scope, $stateParams, $http, $location, toastErrorFct) ->
    $scope.background_image_url = '/img/default_account_wallpaper.jpg'
    $scope.user_image_url       = '/img/travel_planet_logo.png'
    $scope.communities          = []
    username                    = $stateParams.username

    getCommunity = () ->
        $http
            method: 'GET'
            url:    options.api.base_url + '/loginCheck/' + username
            data:
              username: username
        .success (data) ->
            $scope.communities = data
        .error (err) ->
            toastErrorFct.toastError("Impossible de connecter au serveur de communauté, veuillez retenter plus tard")

    getCommunity()

    $scope.goToPassword = (data) ->
        console.log data
        $location.path '/login/verify/' + data.Login + '/' + data.SITE_ID
