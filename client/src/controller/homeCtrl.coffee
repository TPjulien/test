tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location, $interval, $rootScope, $sce, $mdDialog, $window, toastErrorFct, $q) ->
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

    $scope.goTO = (site_id, view_id, view_label, ev) ->
      console.log "one more time!"
      # a mettre pour plus tard
      $mdSidenav('left').close()
      path = '/home/dashboard/' + view_id
      $location.path path

    $scope.getColor = (color) ->
      css = 'background-color:' + color
      return css

    # fonction pour appeller en cas de popover


    # Html pour le menu comme je dois verifier si oui ou non la requete fonctionne
    $scope.bindMenu = () ->
        # on prend une variable variable et on le stocke

        get_infos = []
        final_infos = []
        angular.forEach $scope.viewMenu, (result, key) ->
            get_infos.push result['VIEW_ID']



        console.log get_infos.map
        if get_info.length > 0
            full_link = get_infos.map (view_id) ->
                return options.api.base_url + '/getMultipleView/' + view_id + '/' + decode[0].SITE_ID

            $q.all(full_link.map((url) ->
                $http.get(url).success (data) ->
                   final_infos.push data: data
            )).then ->
                console.log $final_infos

            # console.log result['SITE_ID'], result['VIEW_ID']
            # $http
            #     method : 'GET'
            #     url    : options.api.base_url + '/getMultipleView/' + result['SITE_ID'] + '/' + result['VIEW_ID']
            # .success (data) ->
            #     menu = """<p>Bonjour tout le monde ! </p>"""
            #     console.log data
            # .error (err) ->
            #     console.log err
            # console.log result['SITE_ID'], result['VIEW_ID']
        # console.log $scope.viewMenu
        # after  = "<p>Bonjour tout le monde !</p>"
        # intro_div = """
        #            <md-toolbar style="background-color:transparent; padding-top: 25px;">
        #               <span flex></span>
        #         """
        # check_popover = """<div angular-popover direction="right" close-on-click="false" template-url="/modals/right.html" mode="click" close-on-mouseleave="true" style="position: relative;" ng-repeat="menu in viewMenu">"""
        # final_div = """
        #               <div tooltips tooltip-template="{{menu.VIEW_LABEL}}" tooltip-side="bottom" ng-click="goTO(menu.SITE_ID, menu.VIEW_ID, menu.VIEW_LABEL)"  class="tile-small" data-period="{{menu.view_position}}" data-duration="250" data-role="tile" data-effect="{{menu.animation}}">
        #                   <div class="tile-content">
        #                       <div class="live-slide tiles_size" style="{{getColor(menu.VIEW_COLOR)}};" layout-padding="">
        #                           <img ng-src="{{getImage(menu.VIEW_ICON)}}">
        #                       </div>
        #                       <div class="live-slide tiles_size" style="{{getColor(menu.VIEW_COLOR)}};" layout-padding="">
        #                           <img ng-src="{{getImage(menu.VIEW_ICON)}}">
        #                       </div>
        #                   </div>
        #               </div>
        #             </div>
        #         </md-toolbar>
        #             """
        # menu = intro_div + check_popover + final_div
        # return $sce.trustAsHtml menu


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
    getMenu = () ->
        # console.log "futuresex lovesound"
        # console.log decode[0]
        $http
            method: 'POST'
            url:    options.api.base_url + '/getMenu'
            data:
                site_id   : decode[0].site_id
                user_auth : decode[0].user_auth
                user_id   : decode[0].UID
        .success (data) ->
            $scope.viewMenu = data
            for values in $scope.viewMenu
              values.view_position = getRandomNumber(1)
              values.animation     = null
              values.animation     = getRandomAnimation()
            console.log $scope.viewMenu
        .error (err) ->
            console.log err
    getMenu()
    # $http
    #     method: 'GET'
    #     url:    options.api.base_url + '/getViewSite' + '/' + decode[0].site_id + '/' + decode[0].user_auth
    # .success (result) ->
    #     $scope.viewMenu = result
    #     for values in $scope.viewMenu
    #       values.view_position = getRandomNumber(1)
    #       values.animation     = null
    #       values.animation     = getRandomAnimation()
    #       # une fois qu'on a tous les menus, on lui demande d'aller sur la premiere page par défaut
    #       # $location.path '/home/dashboard/' + decode[0].site_id + '/' + $scope.viewMenu[0].view_id
    # .error (err) ->
    #     toastErrorFct.toastError("Impossible de visualiser menu, veuillez retenter plus tard")

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
