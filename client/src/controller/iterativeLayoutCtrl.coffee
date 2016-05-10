tableau
.controller 'iterativeLayoutCtrl', ($scope, $http, $stateParams, $sce, store, jwtHelper, ticketGeneratorFactory, $interval, $window, $filter, $location, $mdDialog) ->
    token                 = store.get('JWT')
    decode                = jwtHelper.decodeToken(token)
    $scope.actualTemplate = []
    $scope.viewMenu       = []
    $scope.view           = $stateParams.client
    $scope.getAllView     = null
    $scope.id             = $stateParams.id
    ticket                = null
    $scope.dataWithTicket = []
    $scope.url            = []
    $scope.url.getLength  = []
    $scope.dimension      = []
    $scope.items          = []
    $scope.test           = []
    $scope.users          = []
    $scope.data           = []
    counter               = 0
    $scope.allow_filters  = []
    $scope.userText       = null
    $scope.date           =
        startDate: null
        endDate:   null
    $scope.show = false

    $http
        method: 'GET'
        url:    options.api.base_url + '/testSite/' + decode[0].site_id + '/' + decode[0].username
    .success (result) ->
        console.log result
    .error (err) ->
        console.log err

    # console.log decode[0].username
    # $http
    #     method: 'GET'
    #     url:    options.api.base_url + '/getViewSite' + '/' + decode[0].site_id + '/' + decode[0].user_auth
    # .success (result) ->
    #     $scope.viewMenu = result
    # .error (err) ->
    #     console.log err

    getTemplate = (site_id, view_id) ->
        $http
            method: 'GET'
            url:    options.api.base_url + '/currentView/' +  decode[0].tableau_user_id + '/' + decode[0].site + '/' + site_id + '/' + view_id + '/' + decode[0].user_auth + '/' + decode[0].user_id
        .success (result) ->
            $scope.getAllView = result
        .error (err) ->
            $location.path '/home/error'

    getTemplate($scope.view, $scope.id)

    $scope.set_height = (height) ->
        if height
            return { height : height }
        else
            height = { height : "500px" }

    trustHtml = (token, link) ->
        # url = $sce.trustAsResourceUrl("http://data.travelplanet.fr/trusted/" + token + link + '&:toolbar=no' )
        url = "http://data.travelplanet.fr/trusted/" + token + link + '&:toolbar=no'
        return url

    isMessage = (txt, msg) ->
        txt.substring(0, msg.length) == msg

    $scope.loadingText    = "Chargement de la vue en cours ..."
    $scope.urlLoadingView = "modals/loadingView.html"
    $scope.niggeh = (getTableau) ->
        LOADED_INDICATOR =   'tableau.loadIndicatorsLoaded'
        COMPLETE_INDICATOR = 'tableau.completed'
        url = trustHtml(getTableau.token, getTableau.path_to_view)
        placeholder = document.getElementById("tableauViz")
        vizLoaded   = false
        url         = url
        tableauOptions =
            hideTabs: true
            width:  "100%"
            height: getTableau.embed_height
            onFirstInteractive: () ->
                $scope.show = true
        viz = new tableau.Viz(placeholder, url, tableauOptions)
        window.addEventListener('message', (msg) ->
            if (isMessage(msg.data, LOADED_INDICATOR))
                vizLoaded = true
            else if isMessage(msg.data, COMPLETE_INDICATOR)
                if vizLoaded
                else
                    $scope.urlLoadingView = "modals/errorLoading.html"
                    $scope.loadingText = "Impossible de charger cette vue"
        )
