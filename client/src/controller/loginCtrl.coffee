tableau
.controller 'loginCtrl', ($scope, $location) ->
    $scope.login = () ->
        $location.path "/home"
    console.log "Bonjour, la page de login !"
