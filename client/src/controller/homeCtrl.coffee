tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location) ->

    ticket = []
    $scope.logOut = () ->
        logoutFct.logOut()

    $scope.goToTest = () ->
        $location.path '/home/test/' + ticket
    # console.log "hello !"
    token  = store.get('JWT')
    decode = jwtHelper.decodeToken(token)
    console.log decode[0].username
    console.log decode[0].site

    url = options.api.base_url + '/getTicket'
    $http
        method: 'POST'
        url:    url
        data:
            username: decode[0].username
            site:     decode[0].site
    .success (data) ->
        ticket = data
    .error (err) ->
        console.log err

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
