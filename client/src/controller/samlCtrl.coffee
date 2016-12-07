tableau
.controller 'samlCtrl', ($scope, $window, $stateParams, store, $location, jwtHelper, $http, toastErrorFct) ->
    token  = $stateParams.tokenSaml
    decode = jwtHelper.decodeToken(token)

    $http
        method: 'POST'
        url:    options.api.base_url + '/samlLogin'
        data:
            data: decode
    .success (data) ->
        store.set('JWT', data.token)
        $location.path "/home"
    .error (err) ->
        console.log err
