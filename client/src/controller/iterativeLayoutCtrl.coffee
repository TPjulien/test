tableau
.controller 'iterativeLayoutCtrl', ($scope, $stateParams, store, jwtHelper, $http, toastErrorFct) ->
    getId = $stateParams.id
    embedList = []

    $scope.data = []

    filterViewList = (data) ->
        temp = []
        i = 0
        while i < data.length
          if temp.indexOf(data[i]) == -1
              temp.push data[i]
          i++
        return temp

    getViews = () ->
        parameters =
            "type" : "click"
            "key"  : "view"
            "id1"  : "Q1CN"
            "id2"  : getId.toString()

        $http.post 'http://151.80.121.123:7890/api/select/table2', { parameters : parameters, selected : "js_data" }
        .then (data) ->
            values    = ["click", "embed", "Q1CN"]
            embedList = eval data.data[0].js_data
            embedList = embedList[0].list_embed
            embedList = filterViewList(embedList)
            $http.post 'http://151.80.121.123:7890/api/multipleSelect', { values : values, tabIn: embedList }
            .then (data) ->
                temp = null
                for key in data.data
                    temp = angular.fromJson key.js_data
                    if temp[0]
                        $scope.data.push temp[0]
                    else
                        $scope.data.push temp
                console.log $scope.data

    getViews()

    # token                = store.get('JWT')
    # decode               = jwtHelper.decodeToken(token)
    $scope.getController = null
    #
    # # obtenir le template de l'embed ainsi que sa valeur
    $scope.getTemplate = (value) ->
        $scope.getController = value.embed_content_type.toLowerCase() + 'Ctrl'
        result_template      = 'templates/' + value.embed_content_type.toLowerCase() + '.html'
        return result_template
    #
    # user_role = decode[0].user_auth
    # site_id   = decode[0].site_id
    # embed_id  = $stateParams.id
    # # embed_id  = null
    # splitted  = []
    # if embed_id.indexOf('-') != -1
    #     splitted = embed_id.split("-")
    #     view_id  = splitted[0]
    #     embed_id = splitted[1]
    #
    # $http
    #     method: 'POST'
    #     url:    options.api.base_url + '/showEmbed'
    #     data:
    #         user_role  : user_role
    #         site_id    : site_id
    #         embed_id   : embed_id
    # .success (data) ->
    #     $scope.details = data
    # .error (err) ->
    #     toastErrorFct.toastError(err)
