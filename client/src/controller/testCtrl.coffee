tableau
.controller 'testCtrl', ($scope, $http, $stateParams, $sce, store, jwtHelper, ticketGeneratorFactory) ->
    token  = store.get('JWT')
    decode = jwtHelper.decodeToken(token)

    $scope.view    = $stateParams.client
    $scope.getAllView = null
    # $scope.ticket  = $stateParams.ticket
    $scope.id      = $stateParams.id
    ticket = null
    $scope.dataWithTicket = []
    $scope.url = []
    $scope.url.getLength = []

    # url = options.api.base_url + '/getTicket'

    # getViews = () ->
        # console.log decode[0].site
    $http
          method: 'GET'
          url :   options.api.base_url + '/view/' + decode[0].username + '/' + decode[0].site
    .success (result) ->
          $scope.getAllView = result
          console.log result
          # console.log $scope.getAllView.info[0]
    .error (err) ->
          console.log err

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
