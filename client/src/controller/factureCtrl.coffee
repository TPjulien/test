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

    # $http
    #     method: 'GET'
    #     url:    options.api.base_url + '/getPDF'
    # .success (result) ->
    #     $scope.users = result
    # .error (err) ->
    #     console.log err
    # $scope.data = $scope.users.slice 0, 5
    $scope.getMoreData = ->
        min = 0
        max = 5
        $http
            method: 'GET'
            url:    options.api.base_url + '/getPDF/' + min + '/' + max
        .success (result) ->
            console.log min
            $scope.users = result
            $scope.data  = $scope.users.slice min, $scope.data.length + 5
            max = min + max
        .error (err) ->
            console.log err
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
