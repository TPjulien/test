tableau
.controller 'communityCtrl', ($scope, $stateParams, $http, $location) ->
    $scope.background_image_url = '/img/default_account_wallpaper.jpg'
    $scope.user_image_url       = '/img/travel_planet_logo.png'
    $scope.communities          = []
    username                    = $stateParams.username
    $scope.getCommunity = () ->
        $http
            method: 'GET'
            url:    options.api.base_url + '/loginProfils/' + username
        .success (data) ->
            console.log data
            $scope.communities = data
        .error (err) ->
            console.log "une erreur est survenue"
            console.log err

    $scope.getCommunity()

    $scope.goToPassword = (data) ->
        $location.path '/login/verify/' + data.Login + '/' + data.SITE_ID
