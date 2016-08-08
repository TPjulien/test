tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location, $interval, $rootScope, $sce, $mdDialog, $window) ->
    console.log "poison of paradise"
    token                 = store.get('JWT')
    decode                = jwtHelper.decodeToken(token)
    console.log decode
    $rootScope.color      = "#EAEAEA"
    $scope.firstname      = decode[0].firstname
    $scope.lastname       = decode[0].lastname
    $scope.favorite_color = decode[0].favorite_color
    $scope.company        = decode[0].company
    $scope.id_number      = null
    $scope.getListTableau = []

    $mdDialog.hide()
    #
    # testIt()

    $scope.getNumber = (id) ->
      $http
          method: 'GET'
          url:    options.api.base_url + '/getListTemplate/' + id.site_id + '/' + id.view_id
      .success (data) ->
          $scope.getListTableau = data
          console.log data
      .error (err) ->
          console.log err
      $scope.id_number = id

    $scope.numDisp = true;
    if (window.screen.width < 1025)
        $scope.numDisp = false
    else if(window.screen.width > 1024)
        $scope.numDisp = true

    $scope.goTO = (site_id, view_id, view_label) ->
      $mdSidenav('left').close()
      # revoir pourquoi 1/normal
      path = 'home/dashboard/' + site_id + '/' + view_id + '/1/normal'
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
        #encoder url
    $http
        method: 'GET'
        url:    options.api.base_url + '/getViewSite' + '/' + decode[0].site_id + '/' + decode[0].user_auth
    .success (result) ->
        $scope.viewMenu = result
        for values in $scope.viewMenu
          values.view_position = getRandomNumber(1)
          values.animation     = null
          values.animation     = getRandomAnimation()
          # une fois qu'on a tous les menus, on lui demande d'aller sur la premiere page par défaut
          # $location.path '/home/dashboard/' + decode[0].site_id + '/' + $scope.viewMenu[0].view_id
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
      ), 200)


    createFilterFor = (query) ->
        lowercaseQuery = angular.lowercase(query)
        filterFn = (state) ->
            state.value.indexOf(lowercaseQuery) == 0

    $scope.toggleLeft = buildDelayedToggler('left')
