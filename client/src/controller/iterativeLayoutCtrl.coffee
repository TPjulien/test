tableau
.controller 'iterativeLayoutCtrl', ($scope, $http, $stateParams, $sce, store, jwtHelper, $interval, $window, $filter, $location, $mdDialog) ->
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
    $scope.display = "none"

    $scope.dynamic_rows = () ->
        return

    # $http
    #     method: 'GET'
    #     url:    options.api.base_url + '/testSite/' + decode[0].site_id + '/' + decode[0].username
    # .success (result) ->
    #     console.log result
    # .error (err) ->
    #     console.log err

    $scope.url = ""
    $scope.lengthTableau = 0

    getTemplate = (site_id, view_id) ->
        $http
            method: 'GET'
            url:    options.api.base_url + '/currentView/' +  decode[0].tableau_user_id + '/' + decode[0].site + '/' + site_id + '/' + view_id + '/' + decode[0].user_auth
        .success (result) ->
            $scope.getAllView = result
            $scope.lengthTableau = Object.keys($scope.getAllView).length
            if Object.keys($scope.getAllView).length > 2
                $scope.url = "templates/tableau.html"
            else
                $scope.url = "modals/tableau_type.html"
        .error (err) ->
            $location.path '/home/error'

    getTemplate($scope.view, $scope.id)

    $scope.set_height = (height) ->
        if height
            return { height : height }
        else
            height = { height : "500px" }

    trustHtml = (token, link) ->
        url = "https://data.travelplanet.fr/trusted/" + token + link + '&:toolbar=no'
        return url

    isMessage = (txt, msg) ->
        txt.substring(0, msg.length) == msg

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
