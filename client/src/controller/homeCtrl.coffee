tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location, $interval, $rootScope, $sce) ->
    token  = store.get('JWT')
    decode = jwtHelper.decodeToken(token)
    $rootScope.color = "#EAEAEA"

    $scope.firstname      = decode[0].firstname
    $scope.lastname       = decode[0].lastname
    $scope.favorite_color = decode[0].favorite_color
    $scope.company        = decode[0].company
    $scope.logo           = decode[0].logo


    $scope.goTO = (id, view, view_label) ->
      $mdSidenav('left').close()
      path = 'home/dashboard/' + id + '/' + view
      $location.path path

    $scope.getColor = (color) ->
      css = 'background-color:' + color
      return css

    $scope.getFacture = () ->
        $http
            method      : "GET"
            url         : options.api.base_url + '/pdfUser'
            responseType: 'arraybuffer'
        .success (result) ->
            myblob          = new Blob([result], { type: 'application/pdf' })
            blobURL         = (window.URL || window.webkitURL).createObjectURL(myblob)
            anchor          = document.createElement("a")
            anchor.download = "travelplanet.pdf"
            anchor.href     = blobURL
            anchor.click()

    getRandomNumber = (number) ->
      return Math.floor((Math.random() * 6000 ) + (number * 1000))

    $scope.toto = [{
        name: "hello"
    },{
        name: "hello2"
    }, {
        name: "hello3"
    }]


    getRandomAnimation = () ->
      random = Math.floor((Math.random() * 2) + 1)
      if random == 1
        return "slideUpDown"
      else if random == 2
        return "slideLeft"
      else
        return "none"

    $(document).ready ->
        $('.live-tile').liveTile()

    $http
        method: 'GET'
        url:    options.api.base_url + '/getViewSite' + '/' + decode[0].site_id + '/' + decode[0].user_auth
    .success (result) ->
        $scope.viewMenu = result
        for values in $scope.viewMenu
          values.view_position = getRandomNumber(1)
          values.animation     = null
          values.animation     = getRandomAnimation()
        console.log result
    .error (err) ->
        console.log err

    ticket = []
    $scope.logOut = () ->
        logoutFct.logOut()

    $scope.view = null

    $location.path '/home/dashboard/' + decode[0].site_id + '/1'
    # $location.path '/home/dashboard/' + decode[0].site_id + '/3'


    $scope.menu = [{
        id:           1
        name:         "Vue_1"
        templateName: "template de test 1"
    }]

    tick = () ->
        $scope.clock = Date.now()

    tick()
    $interval(tick, 1000)

    $scope.getImage = (src) ->
        url = "img/" + src
        return url

    $scope.goToView = (id) ->
        $location.path '/home/dashboard/' + decode[0].username + '/' + id + '/Factures'

    debounce = (func, wait, context) ->
      timer = undefined
      debounced = () ->
        context = $scope
        args    = Array.prototype.slice.call arguments
        $timeout.cancel timer
        timer   = $timeout(( ->
          timer = 0
          func.apply context, args
        ),wait || 10)

    buildDelayedToggler = (navID) ->
      debounce(( ->
        $mdSidenav(navID)
        .toggle()
        .then ->
          console.log "successful"
      ), 200)

    $scope.checked = false

    # $scope.getRandom = (number) ->
    #   return getRandomNumber(number)
      # return 6000
      # return Math.floor((Math.random() * 6) + 1)

    # $scope.normalRandom = getRandomNumber()
      # return 1200
      # return 1200

    $scope.expandMenu = () ->

        $scope.checked = true
    $scope.changeStyle = () ->
        $scope.checked = false

    $scope.toggleLeft = buildDelayedToggler('left')
