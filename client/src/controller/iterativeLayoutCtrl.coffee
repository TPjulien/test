tableau
.controller 'iterativeLayoutCtrl', ($scope, $stateParams, store, jwtHelper, $http, toastErrorFct) ->
    token                = store.get('JWT')
    decode               = jwtHelper.decodeToken(token)
    $scope.getController = null

    # obtenir le template de l'embed ainsi que sa valeur
    $scope.getTemplate = (value) ->
        $scope.getController = value.embed_content_type + 'Ctrl'
        result_template      = 'templates/' + value.embed_content_type + '.html'
        return result_template

    user_role = decode[0].user_auth
    site_id   = decode[0].site_id
    view_id   = $stateParams.id

    $http
        method: 'POST'
        url:    options.api.base_url + '/showEmbed'
        data:
            user_role: user_role
            site_id:   site_id
            view_id:   view_id
    .success (data) ->
        $scope.details = data
    .error (err) ->
        toastErrorFct.toastError(err)
