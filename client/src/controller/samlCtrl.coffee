tableau
.controller 'samlCtrl', ($scope, $window, $stateParams, store, $location, jwtHelper, $http, toastErrorFct, $state) ->
    token  = $stateParams.tokenSaml
    decode = jwtHelper.decodeToken(token)
    $http.post 'https://api.tp-control.travelplanet.fr/samlLogin', { login: decode.login, username : decode.mail, siteID : decode.siteID, field: decode.ssoId }
    .then (data) ->
        store.set('JWT', data.data.token)
        $state.go "home"
    .catch (err) ->
        toastErrorFct.toastError("Impossible de se connecter avec cet identifiant")
