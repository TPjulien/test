tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct) ->

    $scope.logOut = () ->
        logoutFct.logOut()

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
