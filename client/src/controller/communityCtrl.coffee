tableau
.controller 'communityCtrl', ($scope, $stateParams, $http, $location, toastErrorFct, $window) ->
    $scope.background_image_url = '/img/default_account_wallpaper.jpg'
    $scope.user_image_url       = '/img/travel_planet_logo.png'
    $scope.communities          = []
    username                    = $stateParams.username

    getCommunity = () ->
        parameters =
            key_name  : "login"
            key_value : "farvardi1"

        $http.post 'http://151.80.121.123:7890/api/select/user_lookup/profils', { parameters: parameters, selected: "site_id" }
        .then (data) ->
            temp = []
            for key in data.data
                temp.push key.site_id
            # utiliser temps apres
            $http.post 'http://151.80.121.123:1234/api/multipleSelect', { tabIn: ["R21V"], values: ["base", "sites"] }
            .then (result) ->
                tempResult = []
                for value in result.data
                    tempLoop = angular.fromJson value.js_data
                    # à utiliser tempLoop.label
                    tempResult.push {  login: "jean", label : tempLoop.label, site_id : "Q1CNQ1CN" }
                $scope.communities = tempResult

    getCommunity()

    $scope.goToPassword = (data) ->
        # avant d'aller à goToPassword, il faudra determiner si oui ou non c'est du saml
        $http
            method: 'POST'
            url:    options.api.base_url + '/samlCheck'
            data:
                SITE_ID: data.site_id
        .success (saml_data) ->
            if saml_data[0].SAML_TYPE == 'RENATER'
                $window.location.href = "https://api.tp-control.travelplanet.fr/shibboleth"
            else
                $location.path '/login/verify/' + data.login + '/' + data.site_id
