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

            $scope.userInfos = []
            $scope.viewsMenu = []
            $scope.agg       = []

            $scope.isOpen            = false
            $scope.selectedDirection = "right"
            $scope.selectedMode      = "md-scale"

            $mdDialog.hide()

            infoUser = $http.post 'http://151.80.121.123:7890/api/select/table1', { parameters : { "type": "click", "key" : "site", "id"  : "Q1CN" }, selected: "*" }
            agg      = $http.post 'http://151.80.121.123:7890/api/select/table2', { parameters : { "type": "click", "key" : "add",  "id1" : "Q1CN" }, selected: "*" }
            views    = $http.post 'http://151.80.121.123:7890/api/menu/Q1CN',     { roles: ["90", "91" ] }

            $q.all([
                infoUser
                agg
                views
            ]).then (data) ->
                $scope.userInfos = eval data[0].data[0].js_data
                $scope.viewsMenu = data[2].data
                list_view = []
                for key in data[1].data
                    temp              = eval key.js_data
                    temp[0].view_id   = key.id2
                    $scope.agg.push temp[0]

            $scope.goTo = (embeds) ->
              $state.go 'home.test', { embeds: embeds }

            $scope.bindMenu = (data, view, list_view) ->
                $scope.getEmbeds = null
                menu             = []
                if data.list_view.length != 0
                    menu += """<md-fab-speed-dial md-open="" md-direction="{{selectedDirection}}"
                                       ng-class="selectedMode">
                                <md-fab-trigger>
                                  <md-button style="padding:0; background-color:transparent"  aria-label="menu" class="md-fab">
                                    <img ng-src=" """ + data.groupe_logo + """ ">
                                  </md-button>
                                </md-fab-trigger>"""
                    menu += """ <md-fab-actions> """
                    for view in $scope.viewsMenu
                        if list_view.indexOf(view.view_id.toString()) == 0
                                $scope.getEmbeds = view.view_embed_data
                                menu += """<md-button style="padding:0" ng-click=goTo(getEmbeds) aria-label="test" class="md-fab md-raised md-mini">
                                              <img ng-src=" """ + view.view_logo_base_64 + """ ">
                                           </md-button>"""
                    menu += """</md-fab-actions>
                               </md-fab-speed-dial>"""

                    return $sce.trustAsHtml menu

            $scope.logOut = () ->
                get_action = "logged out"
                ipFct.insertDataIp(get_action)
                logoutFct.logOut()
