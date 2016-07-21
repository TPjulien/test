tableau
.controller 'listTableauCtrl', ($scope, $http, store, jwtHelper, $stateParams, $location) ->
    console.log("hello !")
    token                 = store.get('JWT')
    decode                = jwtHelper.decodeToken(token)
    # $rootScope.color      = "#EAEAEA"
    $scope.firstname      = decode[0].firstname
    $scope.lastname       = decode[0].lastname
    $scope.favorite_color = decode[0].favorite_color
    $scope.company        = decode[0].company
    $scope.dataEmbed      = []

    $scope.getTheView = () ->
        $http
            method: 'GET'
            url:    options.api.base_url + '/getTemplateView/' +  decode[0].tableau_user_id + '/' + decode[0].site + '/' + $stateParams.site_id + '/' + $stateParams.view_id + '/' +  $stateParams.embed_id  + '/' + decode[0].user_auth
        .success (result) ->
            $scope.dataEmbed = result
        .error (err) ->
            # console.log(err)
            $location.path '/home/error'

    $scope.getTheView()

    $scope.loadingText    = "Chargement de la vue en cours ..."
    $scope.urlLoadingView = "modals/loadingView.html"
    $scope.niggeh = (getTableau) ->
        url = trustHtml(dataEmbed[0].token, dataEmbed[0].path_to_view)
        LOADED_INDICATOR =   'tableau.loadIndicatorsLoaded'
        COMPLETE_INDICATOR = 'tableau.completed'
        placeholder = document.getElementById(dataEmbed[0].embed_id)
        vizLoaded   = false
        url         = url
        tableauOptions =
            hideTabs: true
            width:  "100%"
            height: dataEmbed[0].embed_height
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
