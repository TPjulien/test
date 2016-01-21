tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location) ->
    token  = store.get('JWT')
    decode = jwtHelper.decodeToken(token)
    console.log decode[0].username
    console.log decode[0].site

    ticket = []
    $scope.logOut = () ->
        logoutFct.logOut()

    $scope.view = null

    $http
        method: 'POST'
        url :   options.api.base_url + '/route'
        data:
            user: decode[0].username
    .success (data) ->
        $scope.view = data
        console.log data
    .error (err) ->
        console.log err

    $scope.goToView = (id) ->
        $location.path '/home/test/' + ticket + '/' + 'GuillaumeNaturel'
    # console.log "hello !"

    url = options.api.base_url + '/getTicket'
    $http
        method: 'POST'
        url:    url
        data:
            username: decode[0].username
            site:     decode[0].site
    .success (data) ->
        ticket = data
        $location.path '/home/test/' + ticket + '/' + decode[0].username
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
