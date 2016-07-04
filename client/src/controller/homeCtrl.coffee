tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location, $interval, $rootScope, $sce, $mdDialog) ->
    token            = store.get('JWT')
    decode           = jwtHelper.decodeToken(token)
    $rootScope.color = "#EAEAEA"
    $scope.firstname      = decode[0].firstname
    $scope.lastname       = decode[0].lastname
    $scope.favorite_color = decode[0].favorite_color
    $scope.company        = decode[0].company
    $scope.site_logo_type = decode[0].site_logo_type
    $scope.site_logo_base64 = decode[0].site_logo_base64

    $mdDialog.hide()

    $scope.goTO = (id, view, view_label) ->
      $mdSidenav('left').close()
      path = 'home/dashboard/' + id + '/' + view
      $location.path path

    $scope.getColor = (color) ->
      css = 'background-color:' + color
      return css

    getRandomNumber = () ->
      min = 2000;
      max = 7000;
      random = Math.floor(Math.random() * (max - min + 1)) + min;
      return random

    getRandomAnimation = () ->
      random = Math.floor((Math.random() * 3) + 1)
      if random == 1
        return "slideUpDown"
      else if random == 2
        return "slideLeft"
      else
        return "slideRight"

    $http
        method: 'GET'
        url:    options.api.base_url + '/getViewSite' + '/' + decode[0].site_id + '/' + decode[0].user_auth
    .success (result) ->
        console.log result
        $scope.viewMenu = result
        for values in $scope.viewMenu
          values.view_position = getRandomNumber(1)
          values.animation     = null
          values.animation     = getRandomAnimation()
          # une fois qu'on a tous les menus, on lui demande d'aller sur la premiere page par défaut
          $location.path '/home/dashboard/' + decode[0].site_id + '/' + $scope.viewMenu[0].view_id
    .error (err) ->
        console.log err

    $scope.logOut = () ->
        logoutFct.logOut()

    tick = () ->
        $scope.clock = Date.now()

    tick()
    $interval(tick, 1000)

    $scope.getImage = (src) ->
        url = "img/" + src
        return url

    # The sideBar
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
