tableau
.controller 'iterativeLayoutCtrl', ($scope, $stateParams, store, jwtHelper, $http, toastErrorFct) ->
    getId = $stateParams.id
    embedList = []

    $scope.get_css_class = "col s12 row";

    if bowser.msie
        $scope.get_css_class = "col s12 row getIe";

    if $stateParams.embeds == null
        embedList = store.get('set')
    else
        embedList = $stateParams.embeds
        store.set('set', $stateParams.embeds)

    $scope.data = []
    token  = store.get('JWT')
    decode = jwtHelper.decodeToken(token)

    filterViewList = (data) ->
        temp = []
        i = 0
        while i < data.length
          if temp.indexOf(data[i]) == -1
              temp.push data[i]
          i++
        return temp

    getViews = () ->
        values    = ["click", "embed", decode[0].site_id]
        $http.post options.api.base_url + '/multipleSelect', { values : values, tabIn: embedList }
        .then (data) ->
            temp = null
            for key in data.data
                temp = angular.fromJson key.js_data
                if temp[0]
                    $scope.data.push temp[0]
                else
                    $scope.data.push temp

    getViews()

    $scope.getController = null
    $scope.getTemplate = (value) ->
        result_template      = 'templates/' + value.embed_content_type.toLowerCase() + '.html'
        return result_template
