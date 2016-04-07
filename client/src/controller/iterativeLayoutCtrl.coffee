tableau
.controller 'iterativeLayoutCtrl', ($scope, $http, $stateParams, $sce, store, jwtHelper, ticketGeneratorFactory, $interval, $window, $filter, $location) ->
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

    $http
        method: 'GET'
        url:    options.api.base_url + '/getViewSite' + '/' + decode[0].site_id + '/' + decode[0].user_auth
    .success (result) ->
        $scope.viewMenu = result
    .error (err) ->
        console.log err

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
