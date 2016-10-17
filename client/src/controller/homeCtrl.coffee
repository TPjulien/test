tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location, $interval, $rootScope, $sce, $mdDialog, $window, toastErrorFct, $q, $state, ipFct) ->
    if(!store.get('JWT'))
        $state.go 'login'
    else
        if jwtHelper.isTokenExpired(store.get('JWT'))
            store.remove 'JWT'
            $state.go 'login.account'
        else
            token                    = store.get('JWT')
            decode                   = jwtHelper.decodeToken(token)
            site_id                  = decode[0].site_id
            $rootScope.color         = "#EAEAEA"
            $scope.firstname         = decode[0].firstname
            $scope.can_logout        = decode[0].can_logout
            

            $scope.lastname          = decode[0].lastname
            $scope.favorite_color    = decode[0].favorite_color
            $scope.company           = decode[0].company
            $scope.id_number         = null
            $scope.getListTableau    = []
            $scope.multiple_view     = []
            $scope.get_multiple_view = []
            $scope.get_color         = []

            $mdDialog.hide()

            $scope.getNumber = (id) ->
              $http
                  method: 'GET'
                  url:    options.api.base_url + '/getListTemplate/' + id.site_id + '/' + id.view_id
              .success (data) ->
                  $scope.getListTableau = data
              .error (err) ->
                  toastErrorFct.toastError("Impossible de se connecter au serveur de menu, veuillez retenter plus tard")
              $scope.id_number = id

            $scope.numDisp = true;
            if (window.screen.width < 1025)
                $scope.numDisp = false
            else if(window.screen.width > 1024)
                $scope.numDisp = true

            $scope.goTO = (view_id, embed_id, menu) ->
              get_action = "Using " + menu.EMBED_CONTENT_TYPE + " WITH EMBED_ID : " + menu.EMBED_ID + " AND VIEW_ID : " + menu.VIEW_ID
              path = '/home/dashboard/' + view_id + '-' + embed_id
              $location.path path
              # console.log data
              ipFct.insertDataIp(get_action)
              # console.log decode
              # a mettre pour plus tard
              # $mdSidenav('left').close()

            getColor = (color) ->
              css = 'background-color:' + color
              return css

            getImage = (src) ->
                url = "img/" + src
                return url

            $scope.checkMultiple = (data) ->
                return $scope.get_multiple_view

            # fonction pour appeller en cas de popover
            getMultipleView = () ->
              get_infos   = []
              angular.forEach $scope.viewMenu, (value, key) ->
                  get_infos.push value['VIEW_ID']

              final_infos = []

              if get_infos.length > 0
                  full_link = get_infos.map (view_id) ->
                      #return options.api.base_url + '/getMultipleView/' + view_id + '/' + decode[0].site_id + '/' + decode[0].user_auth
                      return options.api.base_url + '/getMultipleView/' + view_id + '/' + decode[0].site_id


                  $q.all(full_link.map((url) ->
                      $http.get(url).success (result) ->
                          if (result.length > 1)
                              custom_key = {}
                              final_infos[result[0].VIEW_ID] = result
                  )).then ->
                      $scope.get_multiple_view = final_infos

            $scope.goToTemplate = (data) ->
                get_action = "Using " + data.EMBED_CONTENT_TYPE + " , " + data.EMBED_LIBELLE + " WITH EMBED_ID : " + data.EMBED_ID + " AND VIEW_ID : " + data.VIEW_ID
                ipFct.insertDataIp(get_action)
                path = '/home/dashboard/' + data.VIEW_ID + "-" + data.EMBED_ID
                $location.path path

            # $scope.returnMultipleImage(image) ->
            #     image = 'data:' + data['EMBED_LOGO_TYPE'] + ';base64,' + data['EMBED_LOGO_BASE_64']

            # Html pour le menu comme je dois verifier si oui ou non la requete fonctionne
            $scope.bindMenu = (data, menu) ->
                color      = $scope.get_color = getColor(data['VIEW_COLOR'])
                # image      = data['VIEW_ICON']
                image = 'data:' + data['VIEW_LOGO_TYPE'] + ';base64,' + data['VIEW_LOGO_BASE_64']

                id         = data['VIEW_ID']
                view_label = data['VIEW_LABEL']
                menu       = []

                if $scope.get_multiple_view.length >= 0
                    if $scope.get_multiple_view[id] != undefined
                        $scope.multiple_view = $scope.get_multiple_view[id]
                        menu += """ <div angular-popover direction="right" close-on-click="false" template-url="/modals/right.html" mode="click" close-on-mouseleave="true" style="position: relative;"> """
                    else
                        menu += """ <div ng-click="goTO(menu.VIEW_ID, menu.EMBED_ID, menu)" style="position: relative;"> """

                menu += """
                              <div tooltips tooltip-template=" """ + view_label + """ " tooltip-side="right" class="tile-small" data-period=" """ + data['view_position'] + """ " data-duration="250" data-role="tile" data-effect=" """ + data['animation'] + """ ">
                                  <div class="tile-content">
                                      <div class="live-slide tiles_size" style=" """ + color + """ " layout-padding="">
                                          <img ng-src=" """ + image + """ ">
                                      </div>
                                      <div class="live-slide tiles_size" style=" """ + color + """ " layout-padding="">
                                          <img ng-src=" """ + image + """ ">
                                      </div>
                                  </div>
                              </div>
                            </div>
                        """
                return $sce.trustAsHtml menu
                    # angular.forEach $scope.viewMenu, (value, key) ->
                    #     console.log get_multiple_view[test]
                        #

                        # console.log value["VIEW_ID"]
                    # console.log get_multiple_view
                    # test = "SITE_ID"
                    # angular.forEach get_multiple_view, (value, key) ->
                        # console.log value, key
                        # angular.forEach value, (value_deep, key_deep) ->
                        #     console.log value_deep, key_deep

                            # console.log value_deep[test], key_deep
                    # console.log get_multiple_view[0]


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
                $http
                    method: 'POST'
                    url:    options.api.base_url + '/getMenu'
                    data:
                        site_id   : decode[0].site_id
                        user_auth : decode[0].user_auth
                .success (data) ->
                    $scope.viewMenu = data
                    for values in $scope.viewMenu
                      values.view_position = getRandomNumber(1)
                      values.animation     = null
                      values.animation     = getRandomAnimation()
                    # on apelle le multiple view pour tout reunir
                    getMultipleView()
                .error (err) ->
                    toastErrorFct.toastError("Impossible d'afficher le menu, veuillez retenter plus tard")
            getMenu()
            $http
                method: 'GET'
                url:    options.api.base_url + '/getImgSite/' + site_id
            .success (data) ->
                $scope.ImgSites = data
            .error (err) ->
                toastErrorFct.toastError("L'icône du site est introuvable")
            # $http
            #     method: 'GET'
            #     url:    options.api.base_url + '/getViewSite' + '/' + decode[0].site_id + '/' + decode[0].user_auth
            # .success (result) ->
            #     $scope.viewMenu = result
            #     # console.log $scope.viewMenu
            #     for values in $scope.viewMenu
            #       values.view_position = getRandomNumber(1)
            #       values.animation     = null
            #       values.animation     = getRandomAnimation()
            #     getMultipleView()
            #       # une fois qu'on a tous les menus, on lui demande d'aller sur la premiere page par défaut
            #       # $location.path '/home/dashboard/' + decode[0].site_id + '/' + $scope.viewMenu[0].view_id
            # .error (err) ->
            #     toastErrorFct.toastError("Impossible de visualiser menu, veuillez retenter plus tard")

            $scope.logOut = () ->
                get_action = "logged out"
                ipFct.insertDataIp(get_action)
                logoutFct.logOut()

            # tick à faire plus tard
            # tick = () ->
            #     $scope.clock = Date.now()
            #
            # tick()
            # $interval(tick, 1000)

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
