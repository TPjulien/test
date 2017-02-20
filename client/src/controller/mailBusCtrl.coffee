tableau
.controller 'mailBusCtrl', ($scope,$http, $sce,alertFct) ->
    $scope.cityName = "";
    $scope.getArrivalData = [];

    $scope.$watch 'cityName', ->
        if $scope.cityName == null
            $scope.getUrl = "null"
            console.log "nope !"
        else
            $scope.getUrl = "http://151.80.121.114:5555/api/arrivalBus/"+ $scope.cityName.title + "/"