tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location, $interval, $rootScope, $sce, $mdDialog, $window, toastErrorFct) ->
    token                 = store.get('JWT')
    decode                = jwtHelper.decodeToken(token)
    $rootScope.color      = "#EAEAEA"
    $scope.firstname      = decode[0].firstname
    $scope.lastname       = decode[0].lastname
    $scope.favorite_color = decode[0].favorite_color
    $scope.company        = decode[0].company
    $scope.id_number      = null
    $scope.getListTableau = []

    $mdDialog.hide()

    $scope.getNumber = (id) ->
      $http
          method: 'GET'
          url:    options.api.base_url + '/getListTemplate/' + id.site_id + '/' + id.view_id
      .success (data) ->
          $scope.getListTableau = data
      .error (err) ->
          # toast en erreur
          toastErrorFct.toastError("Impossible de se connecter au serveur de menu, veuillez retenter plus tard")
      $scope.id_number = id

    $scope.numDisp = true;
    if (window.screen.width < 1025)
        $scope.numDisp = false
    else if(window.screen.width > 1024)
        $scope.numDisp = true

    # $scope.goTO = (site_id, view_id, view_label, ev) ->
    #   params = [{
    #       title: 'Click button if you want',
    #       description: 'Just by giving button ID, mdJoyride clicks the' +
    #                    ' button before focusing an element',
    #       buttonType: 'back-next',
    #       elementId: 'elementId2',
    #       position: 'bottom',
    #       beforeClickButtonId: 'menu-button-id2'
    #   }]
    #   $mdJoyride.ride(params)
      # Permet d'ajouter l'alert en cas de multiple View
      # $mdDialog.show
      #   controller:          'multipleViewCtrl'
      #   templateUrl:         'modals/multipleView.html'
      #   parent:              angular.element(document.body)
      #   targetEvent:         ev
      #   clickOutsideToClose: true
      #   escapeToClose:       true
      #   openFrom:            'left'
      # a mettre pour plus tard
      # $mdSidenav('left').close()
      # path = '/home/dashboard/' + view_id
      # $location.path path

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
        toastErrorFct.toastError("Impossible de visualiser menu, veuillez retenter plus tard")

    $scope.logOut = () ->
        logoutFct.logOut()

    # tick à faire plus tard
    # tick = () ->
    #     $scope.clock = Date.now()
    #
    # tick()
    # $interval(tick, 1000)

    $scope.getImage = (src) ->
        url = "img/" + src
        return url

    # le menu de droite
    # debounce = (func, wait, context) ->
    #   timer = undefined
    #   debounced = () ->
    #     context = $scope
    #     args    = Array.prototype.slice.call arguments
    #     $timeout.cancel timer
    #     timer   = $timeout(( ->
    #       timer = 0
    #       func.apply context, args
    #     ),wait || 10)
    #
    # buildDelayedToggler = (navID) ->
    #   debounce(( ->
    #     $mdSidenav(navID)
    #     .toggle()
    #     .then ->
    #   ), 200)
    #
    # $scope.toggleLeft = buildDelayedToggler('left')
