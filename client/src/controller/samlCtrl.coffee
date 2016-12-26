tableau
.controller 'samlCtrl', ($scope, $window, $stateParams, store, $location, jwtHelper, $http, toastErrorFct, $state) ->
    token  = $stateParams.tokenSaml
    decode = jwtHelper.decodeToken(token)

    $http.post 'https://api.tp-control.travelplanet.fr/samlLogin', { username : decode.mail, siteID : decode.siteID }
    .then (data) ->
        store.set('JWT', data.data.token)
        $state.go "home"
    .catch (err) ->
        # console.log err
        toastErrorFct.toastError("Impossible de se connecter avec cet identifiant")

    # $http
    #     method: 'POST'
    #     url:    options.api.base_url + '/samlLogin'
    #     data:
    #         data: decode
    # .success (data) ->
    #     store.set('JWT', data.token)
    #     $location.path "/home"
    # .error (err) ->
    #     console.log err
