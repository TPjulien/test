tableau
.controller 'communityCtrl', ($scope, $stateParams, $http, $location, toastErrorFct, $window, $state, $mdDialog, store, ipFct, alertFct, vcRecaptchaService) ->
    $scope.background_image_url = '/img/default_account_wallpaper.jpg'
    $scope.user_image_url       = '/img/travel_planet_logo.png'
    $scope.checkCommunity       = true
    $scope.labelCommunities     = []
    loginData                   = $stateParams.data
    username                    = $stateParams.username
    $scope.communityChecked     = false
    $scope.idSelected           = null
    $scope.actualCommunity      = []
    $scope.captcha              = true
    $scope.comText              = "Sélection de la communauté"

    $scope.choosed = (data) ->
        if (data.shib != undefined)
            $http.post 'https://api.test.tp-control.travelplanet.fr/setup', { url: data.shib.shib_url, field: data.shib.shib_field, siteID: data.site_id }
            .then (result) ->
                $window.location.href = "https://api.test.tp-control.travelplanet.fr/postShibboleth"
        else
            $scope.actualCommunity = data
            $scope.idSelected      = data.label
            $scope.checkCommunity  = false

    getCommunity = () ->
        temp = []
        if loginData
            for key in loginData
                temp.push key.site_id
        $http.post 'http://151.80.121.113:3005/api/multipleSelect', { tabIn: temp, values: ["base", "sites"] }
        .then (result) ->
            tempResult = []
            for value in result.data
                id = value.id.toString() + value.id.toString()
                tempLoop = angular.fromJson value.js_data
                if tempLoop.label.indexOf('{"label"') == -1
                    tempResult.push {  login: username, label : tempLoop.label, shib: tempLoop.shib, site_id : id }
                    $scope.labelCommunities.push tempLoop.label
                id = null
            $scope.communities = tempResult
            if ($scope.communities.length == 0 and loginData)
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

    token = (data, callback) ->
        store.set('JWT', data.token)
        if store.get 'JWT'
            get_action = "Logged with click"
            ipFct.insertDataIp(get_action)
        callback true

    $scope.login = () ->
        if $scope.password.length <= 3
            toastErrorFct.toastError("Erreur, le mot de passe est trop court")
        else
            $mdDialog.show
              controller          : 'loadingCtrl'
              templateUrl         : 'modals/loading.html'
              parent              : angular.element(document.body)
              clickOutsideToClose : false
              escapeToClose       : false
            siteId = $scope.actualCommunity.site_id
            if siteId.length > 4
                siteId = siteId.slice(0, 4)
            parameters =
                key_name  : "login"
                key_value : username
                site_id   : siteId
            $http.post 'http://151.80.121.113:3005/api/normalLogin/user_lookup/profils', { parameters: parameters, selected: "user_id" }
            .then (getId) ->
                $http.post 'http://151.80.121.113:3005/api/compare', { username : username ,password : $scope.password, site_id: siteId, user_id: getId.data[0].user_id }
                .then (data) ->
                    token data.data, (result) ->
                        $mdDialog.hide($state.go "home")
                .catch (err) ->
                    toastErrorFct.toastError("Impossible d'acceder à cette communauté")
                    $mdDialog.hide()
