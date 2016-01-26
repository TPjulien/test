tableau
.controller 'testCtrl', ($scope, $http, $stateParams, $sce, store, jwtHelper, ticketGeneratorFactory, $interval) ->
    token  = store.get('JWT')
    decode = jwtHelper.decodeToken(token)
    $scope.actualTemplate = []
    $scope.view    = $stateParams.client
    $scope.getAllView = null
    # $scope.ticket  = $stateParams.ticket
    $scope.id      = $stateParams.id
    ticket = null
    $scope.dataWithTicket = []
    $scope.url = []
    $scope.url.getLength = []
    $scope.dimension = []

    $scope.menu = [{
        id:           1
        name:         "Vue_1"
        templateName: "template de test 1"
    }, {
        id:           2
        name:         "Vue_default"
        templateName: "template par défaut"
    }]

    $scope.changeTemplate = () ->
        console.log $scope.actualTemplate.selectUser.name
        getDimension($scope.actualTemplate.selectUser.name)


    # url = options.api.base_url + '/getTicket'
    getDimension = (type) ->
        $http
            method : 'GET'
            url    :  options.api.base_url + '/getOneDimension/' + decode[0].username + '/' + type
        .success (result) ->
            $scope.dimension = result
            console.log result
        .error (err) ->
            console.log err

    getTemplate = () ->
        $http
              method: 'GET'
              url :   options.api.base_url + '/view/' + decode[0].username + '/' + decode[0].site
        .success (result) ->
              $scope.getAllView = result
              console.log result
              # console.log $scope.getAllView.info[0]
        .error (err) ->
              console.log err

    if $stateParams.id == 'default'
        getTemplate()
        getDimension("Vue_default")
        # console.log "ça rentre dedans !"
    else
        getTemplate()
        # console.log "ça rendre dans l'autre"

    $scope.set_height = (height) ->
        if height
            return { height : height }
        else
            height = { height : "500px" }

    $scope.trustHtml = (token, link) ->
        return $sce.trustAsResourceUrl("http://data.travelplanet.fr/trusted/" + token + '/' + link + '&:toolbar=no' )

    # getViews()

    # getViews().success (data) ->
    #     length  = ['col-md-4', 'col-md-8', 'col-md-12', 'col-md-12']
    #     angular.forEach data, (values, key) ->
    #         promise = ticketGeneratorFactory.getTicket(url, decode[0].username, decode[0].site)
    #         promise.then (res) ->
    #             $scope.url.push $sce.trustAsResourceUrl("http://data.travelplanet.fr/trusted/" + res + '/' + values.path + '&:toolbar=no')
    #             $scope.url.getLength.push length[key]
    #
    #
    # .error (err) ->
    #     console.log err
    #
    # storeTicket = (ticket, index) ->
    #     return ticket
    #
    #
    # getTicket = (url, username, site) ->
    #     test = []
    #     promise = ticketGeneratorFactory.getTicket(url, username, site)
    #     promise.then (data) ->
    #         data
