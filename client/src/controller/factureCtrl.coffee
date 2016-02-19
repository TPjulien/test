tableau
.controller 'factureCtrl', ($scope, $http) ->
    $scope.users = []
    # $scope.users =
    #       [{
    #           "id": 1
    #           "name ": "toto"
    #         },{
    #           "id": 2
    #           "name": "mahefa"
    #         },{
    #           "id": 3
    #           "name": "tristan"
    #         },{
    #           "id": 4
    #           "name": "Juju"
    #         },{
    #           "id": 5
    #           "name": "Betty"
    #         },{
    #           "id": 6
    #           "name": "miguel"
    #         },{
    #           "id": 7
    #           "name": "rocky"
    #         },{
    #           "id": 8
    #           "name": "balboa"
    #         }
    #       ]
    $http
        method: 'GET'
        url:    options.api.base_url + '/getPDF/0/1'
    .success (result) ->
        $scope.users = result
    .error (err) ->
        console.log err
    $scope.data = $scope.users.slice 0, 5

    # $scope.getMoreData = ->
        # console.log $scope.data.length
        # $scope.data = $scope.users.slice 0, $scope.data.length + 5
    #  $scope.images = [1, 2, 3, 4, 5, 6, 7, 8
    #  ]
     #
    #  $scope.loadMore = ->
    #     last = $scope.images[$scope.images.length - 1]
    #     i = 1
    #     while i <= 8
    #       $scope.images.push last + i
    #       i++
    # $scope.factureData = []
