tableau
.controller 'isolatedStepCtrl', ($scope, multiStepFormScope) ->
    $scope.user = angular.copy(multiStepFormScope.user)
    $scope.$on '$destroy', ->
        multiStepFormScope.user = angular.copy($scope.user)

    console.log multiStepFormScope.user
    console.log "ça passe par ce scope isolated"
