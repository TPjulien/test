tableau
.controller 'homeCtrl', ($scope, logoutFct, jwtHelper, store, $http, $stateParams, $location, $sce, $mdDialog, toastErrorFct, $q, $state, ipFct, bitmaskFactory, $timeout, Idle, $window) ->
    Idle.watch()
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
            $scope.isOpen            = false
            $scope.selectedDirection = "right"
            $scope.selectedMode      = "md-scale"
            $scope.userInfos         = []
            $scope.viewsMenu         = []
            roles                    = []

            $mdDialog.hide()

            # Quand l'utilisateur n'est plus sur le site
            $scope.$on 'IdleStart', () ->
                $mdDialog.show
                  controller          : IdleCtrl
                  templateUrl         : 'modals/idleMessage.html'
                  parent              : angular.element(document.body)
                  clickOutsideToClose : false
                  escapeToClose       : false

            IdleCtrl = ($scope,$mdDialog) ->
                $scope.resterconnecter = () ->
                    $mdDialog.hide()

                $scope.logOut = () ->
                    $mdDialog.hide()
                    get_action = "logged out"
                    ipFct.insertDataIp(get_action)
                    logoutFct.logOut_SC()

            deleteAll = (callback) ->
                $mdDialog.hide()
                store.remove 'JWT'
                store.remove 'set'
                return callback true

            $scope.$on 'IdleTimeout', () ->
                deleteAll (result) ->
                    $state.go 'login'

            $http.post 'http://151.80.121.123:7890/api/select/table2', { parameters : { "type" : "click_role_by_user", "key": decode[0].site_id, "id1": decode[0].UID }, selected: "id2"}
            .then (data) ->
                if data.data.length == 0
                    toastErrorFct.toastError "Ce compte n'a pas encore été configuré, vous allez être déconnectée dans 5 secondes"
                    $timeout (->
                      deleteAll (result) ->
                          $state.go "login"
                    ), 5000
                else
                    rolesTemp = []
                    for key in data.data
                      rolesTemp.push key.id2
                    roles.push key.id2
                    infoUser                 = $http.post 'http://151.80.121.123:7890/api/select/table1', { parameters : { "type": "click", "key" : "site", "id" : decode[0].site_id }, selected: "*" }
                    menu                     = $http.post 'http://151.80.121.123:1234/api/menu/' + decode[0].site_id , { roles: rolesTemp }
                    $q.all([
                        infoUser
                        menu
                    ]).then (data) ->
                        temp             = eval data[0].data[0].js_data
                        $scope.userInfos = temp[0]
                        $scope.viewsMenu = data[1].data

            $scope.cancel = () ->
               $mdDialog.hide()

            $scope.goTo = (embeds) ->
                $state.go 'home.test', { embeds : embeds }

            $scope.bindMenu  = (aggMenu) ->
                viewList     = aggMenu.view_list
                tempPosition = []
                viewTemp     = []
                if (viewList)
                  for sorted in viewList
                      tempPosition.push sorted.view_position

                tempPosition.sort (a, b) ->
                    a - b

                for pos in tempPosition
                    for sorted in viewList
                        if pos == sorted.view_position
                            viewTemp.push sorted

                aggMenu.view_list = viewTemp
                $scope.color = aggMenu.groupe_color
                menu         = []
                menu        += """<md-fab-speed-dial md-open="" md-direction="{{selectedDirection}}" ng-class="selectedMode">
                            <md-fab-trigger>"""
                if (aggMenu.view_embed_data)
                    menu += """<md-button style="padding:0; background-color: {{color}};" ng-click=goTo(""" + angular.toJson(aggMenu.view_embed_data) + """)  aria-label="menu" class="md-fab"><md-tooltip style="font-size:15px" md-visible="demo.showTooltip" md-direction="top">""" + aggMenu.groupe_libelle + """</md-tooltip>"""
                else
                    menu += """<md-button style="padding:0; background-color: {{color}};"  aria-label="menu" class="md-fab"><md-tooltip style="font-size:15px" md-visible="demo.showTooltip" md-direction="top">""" + aggMenu.groupe_libelle + """</md-tooltip>"""

                menu += """<img ng-src=" """ + aggMenu.groupe_logo + """ ">
                              </md-button>
                            </md-fab-trigger> <md-fab-actions> """
                if (aggMenu.view_list)
                    if (aggMenu.view_list.length != 0)
                        for view in aggMenu.view_list
                            console.log view.view_label
                            $scope.getEmbeds = view.view_embed_data
                            menu += """<md-button style="padding:0" ng-click=goTo(""" + angular.toJson($scope.getEmbeds)  + """) aria-label="test" class="md-fab md-raised md-mini">
                                          <img ng-src=" """ + view.view_logo_base_64 + """ "><md-tooltip style="font-size:15px" md-visible="demo.showTooltip" md-direction="bottom">""" + view.view_label + """</md-tooltip>
                                       </md-button>
                                       """
                menu += """</md-fab-actions></md-fab-speed-dial>"""
                return $sce.trustAsHtml menu

            $scope.logOut = () ->
                get_action = "logged out"
                ipFct.insertDataIp(get_action)
                logoutFct.logOut()
