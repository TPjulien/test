tableau
.controller 'communityCtrl', ($scope, $stateParams, $http, $location, toastErrorFct, $window) ->
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
        # avant d'aller à goToPassword, il faudra determiner si oui ou non c'est du saml
        $http
            method: 'POST'
            url:    options.api.base_url + '/samlCheck'
            data:
                SITE_ID: data.SITE_ID
        .success (saml_data) ->
            if saml_data[0].SAML_TYPE == 'RENATER'
                $window.location.href = "https://api.test.tp-control.travelplanet.fr/shibboleth"
            else
                $location.path '/login/verify/' + data.Login + '/' + data.SITE_ID
