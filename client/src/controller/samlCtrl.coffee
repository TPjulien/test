tableau
.controller 'samlCtrl', ($scope, $window, $stateParams, store, $location, jwtHelper, $http, toastErrorFct) ->
    token  = $stateParams.tokenSaml
    decode = jwtHelper.decodeToken(token)

    console.log decode
    # site_id = decode.etablissement.substring(0, 8)
    name = decode.display_name

    $http
        method: 'POST'
        url:    options.api.base_url + '/samlLogin'
        data:
            SITE_ID  : name
            username : decode.mail
    .success (data) ->
        store.set('JWT', data.token)
        $location.path "/home"
    .error (err) ->
        toastErrorFct.toastError("Impossible de se connecter, veuillez retenter plus tard")
