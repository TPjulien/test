tableau
.controller "togglerightCtrl", ($scope, $timeout, $mdSidenav, $log) ->


  debounce = (func, wait, context) ->
    timer = undefined
    ->
      `var context`
      context = $scope
      args = Array::slice.call(arguments)
      $timeout.cancel timer
      timer = $timeout((->
        timer = undefined
        func.apply context, args
        return
      ), wait or 10)
      return

  ###*
  # Build handler to open/close a SideNav; when animation finishes
  # report completion in console
  ###

  buildDelayedToggler = (navID) ->
    debounce (->
      # Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID).toggle().then ->
        $log.debug 'toggle ' + navID + ' is done'
        return
      return
    ), 200

  buildToggler = (navID) ->
    ->
      # Component lookup should always be available since we are not using `ng-if`
      $mdSidenav(navID).toggle().then ->
        $log.debug 'toggle ' + navID + ' is done'
        return
      return

  $scope.toggleLeft = buildDelayedToggler('left')
  $scope.toggleRight = buildToggler('right')

  $scope.isOpenRight = ->
    $mdSidenav('right').isOpen()
