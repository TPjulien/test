tableau
.controller 'logOutCtrl', ($scope, $location, ngDialog) ->
    $scope.confirmLogout = () ->
        $location.path '/login'
        ngDialog.close()
