tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location) ->
    token  = store.get('JWT')
    decode = jwtHelper.decodeToken(token)
    console.log decode
    # console.log decode[0].username
    # console.log decode[0].site
    $scope.firstname      = decode[0].firstname
    $scope.lastname       = decode[0].lastname
    $scope.favorite_color = decode[0].favorite_color
    $scope.company        = decode[0].company
    $scope.logo           = decode[0].logo

    ticket = []
    $scope.logOut = () ->
        logoutFct.logOut()

    $scope.view = null

    $http
        method: 'GET'
        url :   options.api.base_url + '/view/' + decode[0].username
    .success (data) ->
        $scope.view = data
        $location.path '/home/test/' + decode[0].username + '/' + data[0].id
    .error (err) ->
        console.log err

    $scope.goToView = (id) ->
        $location.path '/home/test/' + decode[0].username + '/' + id
    # console.log "hello !"

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
