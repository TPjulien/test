tableau
  .controller 'tableauCtrl', ($scope, $http, $sce) ->
      $scope.display = "none"
      console.log "tableau loaded !"
      # console.log $parent.$scope
      # url = null
      # $scope.trustHtml = (token, link) ->
      #     url = $sce.trustAsResourceUrl("http://data.travelplanet.fr/trusted/" + token + link + '&:toolbar=no' )
      #     return url
      #     # return $sce.trustAsResourceUrl("http://data.travelplanet.fr/trusted/" + token + link + '&:toolbar=no' )
      #
      # # itération l'ayout
      # console.log  "ceci est un test"
      # placeholder = document.getElementById("tableauViz")
      # url         = "http://example.com"
      # tableauOptions =
      #     hideTabs: true,
      # viz = new tableau.Viz placeholder, url, tableauOptions
