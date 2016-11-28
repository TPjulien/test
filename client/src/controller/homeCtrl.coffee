tableau
.controller 'homeCtrl', ($scope, $mdSidenav, $timeout, logoutFct, jwtHelper, store, $http, $stateParams, $location, $interval, $rootScope, $sce, $mdDialog, $window, toastErrorFct, $q, $state, ipFct, bitmaskFactory) ->
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

            $scope.userInfos = []
            $scope.viewsMenu = []
            $scope.agg       = []

            $scope.isOpen = false
            $scope.selectedDirection = "right"
            $scope.selectedMode = "md-scale"
            embeds_map =  []


            $mdDialog.hide()

            # Get du site
            getInfoUser = () ->
                parameters =
                    "type" : "click"
                    "key"  : "site"
                    "id"   : "Q1CN"
                $http.post 'http://151.80.121.123:7890/api/select/table1', { parameters : parameters, selected : "*" }
                .then (data) ->
                    $scope.userInfos = eval data.data[0].js_data

            getViews = () ->
                parameters =
                    "type" : "click"
                    "key"  : "view"
                    "id1"   : "Q1CN"
                $http.post 'http://151.80.121.123:7890/api/select/table2', { parameters : parameters, selected : "*" }
                .then (data) ->
                    for key in data.data
                        temp              = eval key.js_data
                        temp[0].view_id   = key.id2
                        $scope.viewsMenu.push temp[0]
                    getBitmask()
                        # for key in $scope.viewsMenu
                        #     console.log key.map_embed
                    # console.log "bitmask !", $scope.viewsMenu

            # le bitmask a mettre du coté des embed à afficher
            getBitmask = () ->
                $http.post 'http://151.80.121.123:7890/api/getUserBitmask/Q1CN', { roles: ["91"] }
                .then (data) ->
                    console.log "c'est dans data !", data.data
                    embedBm   = []
                    map_embed = []
                    for key in $scope.viewsMenu
                        if key.map_embed
                            map_embed = key.map_embed
                            angular.forEach key.map_embed, (result, key) ->
                                if embedBm.length == 0
                                    embedBm = result
                                else
                                    embedBm = bitmaskFactory.fuse result, embedBm

                    console.log "embed", embedBm
                    embedBm = [22, 0, 0, 268435456]
                    temp = bitmaskFactory.compare(data.data.bitmask, embedBm)
                    console.log "voici le compare !", temp
                    result = bitmaskFactory.decode(temp)
                    console.log "voici le decode !", result

            getAgg = () ->
                parameters =
                    "type": "click"
                    "key" : "agg"
                    "id1" : "Q1CN"
                $http.post 'http://151.80.121.123:7890/api/select/table2', { parameters : parameters, selected : "*" }
                .then (data) ->
                    list_view = []
                    for key in data.data
                        temp              = eval key.js_data
                        temp[0].view_id   = key.id2
                        $scope.agg.push temp[0]

            getAgg()
            getViews()
            getInfoUser()

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

            $scope.goTo = (content_id) ->
              path = '/home/dashboard/' + content_id
              $location.path path

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
                      return options.api.base_url + '/getMultipleView/' + view_id + '/' + decode[0].site_id


                  $q.all(full_link.map((url) ->
                      $http.get(url).success (result) ->
                          if (result.length > 1)
                              custom_key = {}
                              final_infos[result[0].VIEW_ID] = result
                  )).then ->
                      $scope.get_multiple_view = final_infos

            $scope.goToTemplate = (data) ->
                get_action = "Using " + data.EMBED_CO NTENT_TYPE + " , " + data.EMBED_LIBELLE + " WITH EMBED_ID : " + data.EMBED_ID + " AND VIEW_ID : " + data.VIEW_ID
                ipFct.insertDataIp(get_action)
                path = '/home/dashboard/' + data.VIEW_ID + "-" + data.EMBED_ID
                $location.path path

            $scope.bindMenu = (data, view, list_view) ->
                if data.list_view.length != 0
                    menu = []
                    # premier premiere itération
                    menu += """<md-fab-speed-dial md-open="" md-direction="{{selectedDirection}}"
                                       ng-class="selectedMode">
                                <md-fab-trigger>
                                  <md-button style="padding:0; background-color:transparent"  aria-label="menu" class="md-fab">
                                    <img ng-src=" """ + data.groupe_logo + """ ">
                                  </md-button>
                                </md-fab-trigger>"""
                    menu += """ <md-fab-actions> """
                    for idView in list_view
                        for dataView in view
                            if dataView.view_id == idView and dataView.list_embed.length != 0
                                menu += """<md-button style="padding:0" ng-click=goTo(""" + dataView.view_id.toString() + """) aria-label="test" class="md-fab md-raised md-mini">
                                              <img ng-src=" """ + dataView.view_logo_base_64 + """ ">
                                           </md-button>"""
                    menu += """</md-fab-actions>
                               </md-fab-speed-dial>"""

                    return $sce.trustAsHtml menu

            $scope.logOut = () ->
                get_action = "logged out"
                ipFct.insertDataIp(get_action)
                logoutFct.logOut()
