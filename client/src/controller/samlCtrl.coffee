tableau
.controller 'samlCtrl', ($scope, $window, $stateParams, store, $location, jwtHelper, $http, toastErrorFct) ->
    token  = $stateParams.tokenSaml
    decode = jwtHelper.decodeToken(token)

    $http
        method: 'POST'
        url:    options.api.base_url + '/samlLogin'
        data:
            SITE_ID  : decode[0].etablissement
            username : decode[0].uid
    .success (data) ->
        store.set('JWT', data.token)
        $location.path "/home"
    .error (err) ->
        toastErrorFct.toastError("Impossible de se connecter, veuillez retenter plus tard")
