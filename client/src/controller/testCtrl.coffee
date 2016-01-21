tableau
.controller 'testCtrl', ($scope, $http, $stateParams, $sce) ->
    $scope.view    = $stateParams.client
    $scope.ticket  = $stateParams.ticket

    $http
        method: 'POST'
        url :   options.api.base_url + '/route'
        data:
            user: $scope.view
    .success (data) ->
        $scope.url     = "http://data.travelplanet.fr/trusted/" + $scope.ticket + data[1].path
        $scope.trusted = $sce.trustAsResourceUrl($scope.url)
        console.log data
    .error (err) ->
        console.log err
