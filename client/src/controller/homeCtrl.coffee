tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location, $interval, $rootScope) ->
    token  = store.get('JWT')
    decode = jwtHelper.decodeToken(token)
    if decode[0].favorite_background
        $rootScope.wallpaper  = "url('" + decode[0].favorite_background + "')"
    else
        $rootScope.wallpaper = "url('http://www.travelimg.org/wp-content/uploads/2015/02/full_hd_travel_wallpapers_21.jpg')"

    $scope.firstname      = decode[0].firstname
    $scope.lastname       = decode[0].lastname
    $scope.favorite_color = decode[0].favorite_color
    $scope.company        = decode[0].company
    $scope.logo           = decode[0].logo


    $scope.goTO = (id, view, view_label) ->

      if view_label == "Factures"
        path = 'home/dashboard/' + id + '/' + view + '/' + view_label
      else
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


    $http
        method: 'GET'
        url:    options.api.base_url + '/getViewSite' + '/' + decode[0].site_id
    .success (result) ->
        $scope.viewMenu = result
    .error (err) ->
        console.log err

    ticket = []
    $scope.logOut = () ->
        logoutFct.logOut()

    $scope.view = null

    $location.path '/home/dashboard/' + decode[0].site_id + '/1'


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

    $scope.toggleLeft = buildDelayedToggler('left')
