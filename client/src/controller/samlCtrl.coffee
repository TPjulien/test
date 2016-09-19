tableau
.controller 'samlCtrl', ($scope, $window, $stateParams, store, $location, jwtHelper, $http) ->
    # console.log "ceci est le saml du projet"
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
        console.log err


    # console.log decode
    # store.set('JWT', token)
    # $location.path "/home"
