tableau
  .controller 'tableauCtrl', ($scope, $http, $sce, $stateParams, jwtHelper, store) ->

      token                 = store.get('JWT')
      decode                = jwtHelper.decodeToken(token)
      $scope.tableauToken   = []
      $scope.tableauData    = []
      $scope.tableauDisplay = "none"
      $scope.loadingDisplay = "block"
      site_id               = decode[0].site_id
      uid                   = decode[0].UID
      site_id_parse         = site_id.substr(0,4)
      tableau_site          = site_id_parse + uid
      $scope.loadingText    = "Chargement de la vue en cours ..."
      $scope.urlLoadingView = "modals/loadingView.html"

      $scope.init = (info) ->
          $scope.tableauData = info
          getTableauToken()

      getTableauToken = () ->
        url = options.api.base_url + '/tokenExchange'
        $http.post url, { tableau_site : $scope.tableauData.tableau_site , user_name : tableau_site }
        .then (data) ->
            $scope.tableauToken = data.data.token
            getTableau()

      $scope.trustHtml = () ->
          tableau_url = null
          if $scope.tableauData.tableau_site == "Default"
              tableau_url = '/views/' + $scope.tableauData.tableau_view + '?:embed=yes&:toolbar=no'
          else
              tableau_url = '/t/' + $scope.tableauData.tableau_site + '/views/' + $scope.tableauData.tableau_view + '?:embed=yes&:toolbar=no'
          url = "https://data.travelplanet.fr/trusted/" + $scope.tableauToken + tableau_url
          return url

      isMessage  = (txt, msg) -> txt.substring(0, msg.length) == msg
      getTableau = () ->
          url                = $scope.trustHtml()
          LOADED_INDICATOR   = 'tableau.loadIndicatorsLoaded'
          COMPLETE_INDICATOR = 'tableau.completed'
          placeholder        = document.getElementById('divMahefa')
          vizLoaded          = false
          url                = url
          tableauOptions     = { hideTabs : true ,width : "100%", height : $scope.tableauData.embed_height }
          onFirstInteractive: () -> $scope.display = "block"
          viz = new tableau.Viz(placeholder, url, tableauOptions)
          window.addEventListener('message', (msg) ->
              if (isMessage(msg.data, LOADED_INDICATOR))
                  vizLoaded      = true
                  $scope.display = "none"
              else if isMessage(msg.data, COMPLETE_INDICATOR)
                  $scope.tableauDisplay = "block"
                  $scope.loadingDisplay = "none"
                  if vizLoaded
                      viz.dispose()
                      $scope.display = "block"
                  else
                      $scope.urlLoadingView = "modals/errorLoading.html"
                      $scope.loadingText    = "Impossible de charger cette vue"
                      $scope.display        = "none"
          )
