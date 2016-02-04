tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location, $interval, $rootScope) ->
    $rootScope.wallpaper = "none"
    token  = store.get('JWT')
    decode = jwtHelper.decodeToken(token)
    $scope.firstname      = decode[0].firstname
    $scope.lastname       = decode[0].lastname
    $scope.favorite_color = decode[0].favorite_color
    $scope.company        = decode[0].company
    $scope.logo           = decode[0].logo

    console.log decode
    console.log "hello"


    $scope.getFacture = () ->
        $http
            method      : "GET"
            url         : options.api.base_url + '/pdfUser'
            responseType: 'arraybuffer'
        .success (result) ->
            myblob = new Blob([result], { type: 'application/pdf' })
            blobURL = ( window.URL || window.webkitURL).createObjectURL(myblob)
            anchor = document.createElement("a")
            anchor.download = "travelplanet.pdf"
            anchor.href = blobURL
            anchor.click()


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

    $scope.goToView = (id) ->
        $location.path '/home/test/' + decode[0].username + '/' + id

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
