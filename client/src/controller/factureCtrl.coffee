tableau
.controller 'factureCtrl', ($scope, $http) ->
    $scope.users = []


    $scope.download = (selected) ->
        console.log selected

    requestFacture = (min, max) ->
      $http
          method: 'GET'
          url:    options.api.base_url + "/getPDF/" + min + "/" + max
      .success (result) ->
          $scope.status = "Afficher plus de facture"
          $scope.users = result
      .error (err) ->
          console.log err

    $scope.data = $scope.users.slice 0, 5

    $scope.loadMore = ->
        console.log $scope.data.length
        $scope.data = $scope.users.slice 0, $scope.data.length + 20
        requestFacture($scope.data.length, $scope.data.length + 20)
