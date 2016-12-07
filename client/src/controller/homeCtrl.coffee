tableau
.controller 'homeCtrl', ($scope, logoutFct, jwtHelper, store, $http, $stateParams, $location, $sce, $mdDialog, toastErrorFct, $q, $state, ipFct, bitmaskFactory) ->
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

            $http.post 'http://151.80.121.123:7890/api/select/table2', { parameters : { "type" : "click_role_by_user", "key": "Q1CN", "id1": decode.UID }, selected: "id2"}
            .then (data) ->
                for key in data.data
                    roles.push key.id2
                    infoUser                 = $http.post 'http://151.80.121.123:7890/api/select/table1', { parameters : { "type": "click", "key" : "site", "id" : "Q1CN" }, selected: "*" }
                    menu                     = $http.post 'http://151.80.121.123:1234/api/menu/Q1CN',     { roles: ["1", "2"] }
                    $q.all([
                        infoUser
                        menu
                    ]).then (data) ->
                        temp             = eval data[0].data[0].js_data
                        $scope.userInfos = temp[0]
                        $scope.viewsMenu = data[1].data

            $scope.goTo = (embeds) ->
                $state.go 'home.test', { embeds : embeds }

            $scope.bindMenu  = (aggMenu) ->
                $scope.color = aggMenu.groupe_color
                menu         = []
                menu        += """<md-fab-speed-dial md-open="" md-direction="{{selectedDirection}}" ng-class="selectedMode">
                            <md-fab-trigger>"""
                if (aggMenu.view_embed_data)
                    menu += """<md-button style="padding:0; background-color: {{color}};" ng-click=goTo(""" + angular.toJson(aggMenu.view_embed_data) + """)  aria-label="menu" class="md-fab">"""
                else
                    menu += """<md-button style="padding:0; background-color: {{color}};"  aria-label="menu" class="md-fab">"""

                menu += """<img ng-src=" """ + aggMenu.groupe_logo + """ ">
                              </md-button>
                            </md-fab-trigger> <md-fab-actions> """
                if (aggMenu.view_list)
                    if (aggMenu.view_list.length != 0)
                        for view in aggMenu.view_list
                            $scope.getEmbeds = view.view_embed_data
                            menu += """<md-button style="padding:0" ng-click=goTo(""" + angular.toJson($scope.getEmbeds)  + """) aria-label="test" class="md-fab md-raised md-mini">
                                          <img ng-src=" """ + view.view_logo_base_64 + """ ">
                                       </md-button>"""
                menu += """</md-fab-actions></md-fab-speed-dial>"""
                return $sce.trustAsHtml menu

            $scope.logOut = () ->
                get_action = "logged out"
                ipFct.insertDataIp(get_action)
                logoutFct.logOut()
