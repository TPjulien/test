tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http) ->

    $scope.logOut = () ->
        logoutFct.logOut()

    # console.log "hello !"
    token  = store.get('JWT')
    decode = jwtHelper.decodeToken(token)
    console.log decode[0].username
    console.log decode[0].site
    url = 'http://data.travelplanet.fr/trusted'
    $http
        method: 'POST'
        url:    url
        params:
            username:    decode[0].username
            target_size: decode[0].site
        headers:
            'Content-Type': 'application/x-www-form-urlencoded'
    .success (data) ->
        console.log data
    .error (err) ->
        console.log err
    # console.log url
    # $http.post url
    # .then (response) ->
    #     console.log response

    # $http
    #     method: 'POST'
    #     url:    url
    # .success (data) ->
    #     console.log data
    # .error (err) ->
    #     console.log err


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
