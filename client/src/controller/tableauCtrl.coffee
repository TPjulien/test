tableau
  .controller 'tableauCtrl', ($scope, $http, $sce) ->
      $scope.trustHtml = (token, link) ->
          return $sce.trustAsResourceUrl("http://data.travelplanet.fr/trusted/" + token + link + '&:toolbar=no' )
