tableau
.controller 'iterativeLayoutCtrl', ($scope, $stateParams, store, jwtHelper, $http) ->
    token                    = store.get('JWT')
    decode                   = jwtHelper.decodeToken(token)
    # $scope.view              = $stateParams.client
    # $scope.id                = $stateParams.id
    $scope.getController     = null

    # obtenir le template de l'embed ainsi que sa valeur
    $scope.getTemplate = (value) ->
        $scope.getController = value.embed_content_type + 'Ctrl'
        result_template      = 'templates/' + value.embed_content_type + '.html'
        # $scope.getController = 'profilCtrl'
        # result_template      = 'templates/profil.html'
        return result_template

    user_role = decode[0].user_auth
    site_id   = decode[0].site_id
    view_id   = 1
    $http
        method: 'POST'
        url:    options.api.base_url + '/showEmbed'
        data:
            user_role: user_role
            site_id:   site_id
            view_id:   view_id
    .success (data) ->
        $scope.details = data
        console.log 'details'
        console.log $scope.details
    .error (err) ->
        # ajouter un toast en cas d'erreur
        console.log err
