tableau
.controller 'iterativeLayoutCtrl', ($scope, $stateParams, store, jwtHelper, $http, toastErrorFct) ->
    token                = store.get('JWT')
    decode               = jwtHelper.decodeToken(token)
    $scope.getController = null

    # obtenir le template de l'embed ainsi que sa valeur
    $scope.getTemplate = (value) ->
        $scope.getController = value.EMBED_CONTENT_TYPE.toLowerCase() + 'Ctrl'
        result_template      = 'templates/' + value.EMBED_CONTENT_TYPE.toLowerCase() + '.html'
        return result_template

    user_role = decode[0].user_auth
    site_id   = decode[0].site_id
    embed_id  = $stateParams.id
    # embed_id  = null
    splitted  = []
    if embed_id.indexOf('-') != -1
        splitted = embed_id.split("-")
        view_id  = splitted[0]
        embed_id = splitted[1]

    console.log embed_id

    $http
        method: 'POST'
        url:    options.api.base_url + '/showEmbed'
        data:
            user_role  : user_role
            site_id    : site_id
            embed_id   : embed_id
    .success (data) ->
        $scope.details = data
    .error (err) ->
        toastErrorFct.toastError(err)
