tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, ngDialog) ->

    $scope.logOut = () ->
        ngDialog.open {
            template:   'modals/logout.html',
            controller: 'logOutCtrl'
        }
    # console.log "Bonjour, voici le home !"
    debounce = (func, wait, context) ->
      timer = undefined

      debounced = () ->
        context = $scope
        args    = Array.prototype.slice.call arguments
        $timeout.cancel timer
        timer = $timeout(( ->
          timer = 0
          func.apply context, args
        ),wait || 10)

    buildDelayedToggler = (navID) ->
      debounce(( ->
        $mdSidenav(navID)
        .toggle()
        .then ->
          console.log "toggle " + navID + " is done"
      ), 200)

    $scope.toggleLeft = buildDelayedToggler('left')
