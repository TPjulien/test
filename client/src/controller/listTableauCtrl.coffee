tableau
.controller 'listTableauCtrl', ($scope, $http, store, jwtHelper, $stateParams) ->
    console.log("hello !")
    token                 = store.get('JWT')
    decode                = jwtHelper.decodeToken(token)
    # $rootScope.color      = "#EAEAEA"
    $scope.firstname      = decode[0].firstname
    $scope.lastname       = decode[0].lastname
    $scope.favorite_color = decode[0].favorite_color
    $scope.company        = decode[0].company

    $scope.getTheView = () ->
        $http
            method: 'GET'
            url:    options.api.base_url + '/getTemplateView/' +  decode[0].tableau_user_id + '/' + decode[0].site + '/' + site_id + '/' + view_id + '/' +  $stateParams.embed_id  + '/' + decode[0].user_auth + '/' + decode[0].user_id
        .success (result) ->
            $scope.getAllView = result
            $scope.lengthTableau = Object.keys($scope.getAllView).length
            if Object.keys($scope.getAllView).length > 2
                $scope.url = "templates/tableau.html"
            else
                $scope.url = "modals/tableau_type.html"
        .error (err) ->
            $location.path '/home/error'

    $scope.loadingText    = "Chargement de la vue en cours ..."
    $scope.urlLoadingView = "modals/loadingView.html"
    $scope.niggeh = (getTableau) ->
        url = trustHtml(getTableau.token, getTableau.path_to_view)
        LOADED_INDICATOR =   'tableau.loadIndicatorsLoaded'
        COMPLETE_INDICATOR = 'tableau.completed'
        placeholder = document.getElementById(getTableau.embed_id)
        vizLoaded   = false
        url         = url
        tableauOptions =
            hideTabs: true
            width:  "100%"
            height: getTableau.embed_height
            onFirstInteractive: () ->
                $scope.show    = true
                $scope.display = "block"
        viz = new tableau.Viz(placeholder, url, tableauOptions)
        window.addEventListener('message', (msg) ->
            if (isMessage(msg.data, LOADED_INDICATOR))
                vizLoaded     = true
                $scope.display = "none"
            else if isMessage(msg.data, COMPLETE_INDICATOR)
                if vizLoaded
                    viz.dispose()
                    $scope.display = "block"
                else
                    $scope.urlLoadingView = "modals/errorLoading.html"
                    $scope.loadingText    = "Impossible de charger cette vue"
                    $scope.display        = "none"
        )
