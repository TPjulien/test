tableau
.controller 'mailBusCtrl', ($scope,$http, $sce,alertFct) ->
    $scope.cityName = "";
    $scope.getArrivalData = [];

    $scope.$watch 'cityName', ->
        $scope.getUrl = "http://151.80.121.114:5555/api/arrivalBus/"+ $scope.cityName.title + "/"