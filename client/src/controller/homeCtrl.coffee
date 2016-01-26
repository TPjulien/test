tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location, $interval) ->
    token  = store.get('JWT')
    decode = jwtHelper.decodeToken(token)
    $scope.firstname      = decode[0].firstname
    $scope.lastname       = decode[0].lastname
    $scope.favorite_color = decode[0].favorite_color
    $scope.company        = decode[0].company
    $scope.logo           = decode[0].logo

    ticket = []
    $scope.logOut = () ->
        logoutFct.logOut()

    $scope.view = null

    $location.path '/home/test/' + decode[0].username + '/default'

    $scope.menu = [{
        id:           1
        name:         "Vue_1"
        templateName: "template de test 1"
    }]

    tick = () ->
        $scope.clock = Date.now()

    tick()
    $interval(tick, 1000)

    # $http
    #     method: 'GET'
    #     url :   options.api.base_url + '/view/' + decode[0].username + '/' + decode[0].site
    # .success (data) ->
    #     console.log data
    #     $scope.view = data
    #     $location.path '/home/test/' + decode[0].username + '/' + data[0].id
    # .error (err) ->
    #     console.log err

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
