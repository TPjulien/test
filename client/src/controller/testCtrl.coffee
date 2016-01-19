tableau
.controller 'testCtrl', ($scope, $http, $stateParams, $sce) ->
    $scope.ticket  = $stateParams.ticket
    $scope.url     = "http://data.travelplanet.fr/trusted/" + $scope.ticket + "/t/anses/views/Book_map_live/Dashboard1?:embed=yes"
    $scope.trusted = $sce.trustAsResourceUrl($scope.url)
    #http://data.travelplanet.fr/trusted/{{ticket}}/views/Book_map_live/Dashboard1?:embed=yes
    # $http
    #     method: 'GET'
    #     url:    options.api.base_url + '/test'
    # .success (data) ->
    #     console.log data
    # .error (err) ->
    #     console.log err
    # $http,
    #   METHOD: 'POST'
