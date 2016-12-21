tableau
.controller 'communityCtrl', ($scope, $stateParams, $http, $location, toastErrorFct, $window, $state, $mdDialog, store, ipFct, alertFct, vcRecaptchaService) ->
    $scope.background_image_url = '/img/default_account_wallpaper.jpg'
    $scope.user_image_url       = '/img/travel_planet_logo.png'
    $scope.checkCommunity       = true
    $scope.labelCommunities     = []
    username                    = $stateParams.username
    $scope.communityChecked     = false
    $scope.idSelected           = null
    $scope.actualCommunity      = []
    $scope.captcha              = true
    $scope.comText              = "Sélection de la communauté"


    $scope.choosed = (data) ->
        $scope.actualCommunity = data
        $scope.idSelected = data.label
        $scope.checkCommunity = false

    getCommunity = () ->
        parameters =
            key_name  : "login"
            key_value : username
        $http.post 'http://151.80.121.123:7890/api/select/user_lookup/profils', { parameters: parameters, selected: "site_id" }
        .then (data) ->
            temp = []
            for key in data.data
                temp.push key.site_id
            $http.post 'http://151.80.121.123:1234/api/multipleSelect', { tabIn: temp, values: ["base", "sites"] }
            .then (result) ->
                tempResult = []
                for value in result.data
                    id = value.id.toString() + value.id.toString()
                    tempLoop = angular.fromJson value.js_data
                    if tempLoop.label.indexOf('{"label"') == -1
                        tempResult.push {  login: username, label : tempLoop.label, site_id : id }
                        $scope.labelCommunities.push tempLoop.label
                    id = null
                $scope.communities = tempResult
                if ($scope.communities.length == 0)
                    toastErrorFct.toastError("L'utilisateur : " + username + " n'existe pas")
                    $state.go 'login.account'
                else if ($scope.communities.length == 1)
                    $scope.comText         = "Vôtre communauté"
                    $scope.actualCommunity = $scope.communities[0]
                    $scope.idSelected      = $scope.communities[0].label
                    $scope.checkCommunity  = false

    getCommunity()

    $scope.setResponse = (data) ->
        # la réponse plus tard
        $scope.captcha = false

    $scope.login = () ->
        $mdDialog.show
          controller          : 'loadingCtrl'
          templateUrl         : 'modals/loading.html'
          parent              : angular.element(document.body)
          clickOutsideToClose : false
          escapeToClose       : false
        $http
            method: 'POST'
            url:    options.api.base_url + '/login'
            data: {
                SITE_ID  : $scope.actualCommunity.site_id
                username : $scope.actualCommunity.login
                password : $scope.password
            }
        .success (data) ->
            store.set('JWT', data.token)
            if store.get 'JWT'
                get_action = "Logged with click"
                ipFct.insertDataIp(get_action)
            $state.go "home"
        .error (err) ->
            alertFct.loginError()
            $mdDialog.hide()

    # $scope.goToPassword = (data) ->
    #     console.log data
        # avant d'aller à goToPassword, il faudra determiner si oui ou non c'est du saml
        # $http
        #     method: 'POST'
        #     url:    options.api.base_url + '/samlCheck'
        #     data:
        #         SITE_ID: data.site_id
        # .success (saml_data) ->
        #     if saml_data[0].SAML_TYPE == 'RENATER'
        #         $window.location.href = "https://api.tp-control.travelplanet.fr/shibboleth"
        #     else
        #         $location.path '/login/verify/' + data.login + '/' + data.site_id
