tableau
.controller 'samlCtrl', ($scope, $window, $stateParams, store, $location, jwtHelper, $http, toastErrorFct) ->
    token  = $stateParams.tokenSaml
    decode = jwtHelper.decodeToken(token)

    # site_id =
    site_id = decode.etablissement.substring(0, 8)
    # console.log decode

    $http
        method: 'POST'
        url:    options.api.base_url + '/samlLogin'
        data:
            SITE_ID  : site_id
            username : decode.mail
    .success (data) ->
        store.set('JWT', data.token)
        $location.path "/home"
    .error (err) ->
        toastErrorFct.toastError("Impossible de se connecter, veuillez retenter plus tard")
