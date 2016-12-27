tableau
.controller 'cacheCtrl', ($scope) ->
    $scope.getRandomSpan = () ->
      return Math.floor((Math.random()*6)+1)

    $scope.cacheNum = $scope.getRandomSpan()

    $scope.styleCached = "css/tableau-styles.css?v=" + $scope.cacheNum
    $scope.componentsCached = "css/tableau-components.css?v=" + $scope.cacheNum
