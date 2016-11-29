tableau
  .controller 'tableauCtrl', ($scope, $http, $sce, $stateParams, jwtHelper, store) ->

      token       = store.get('JWT')
      decode      = jwtHelper.decodeToken(token)
      $scope.show = true
      $scope.data = []

      $scope.tableauData = []
      $scope.init = (info) ->
          console.log "ça init la !"
          $scope.tableauData = info
          getTableauRequest()

      $scope.tableauDisplay = "none"
      $scope.loadingDisplay = "block"

      site_id        = decode[0].site_id
      uid            = decode[0].UID
      site_id_parse  = site_id.substr(0,4)
      tableau_site   = site_id_parse + uid
      view_id        = undefined
      embed_id       = undefined
      splitted       = []

      $scope.data_tableau = []

      getTableauRequest = () ->
          $http
              method : 'POST'
              url    :  options.api.base_url + '/getTableau'
              data   :
                  site_id       : site_id
                  get_user_name : tableau_site
                  view_id       : view_id
                  embed_id      : "123"
          .success (data) ->
              $scope.data = data
              getTableau()
          .error (err) ->
              console.log err
          $scope.display = "none"

      $scope.trustHtml = () ->
          tableau_url = null
          if $scope.data.tableau_site == "Default"
              tableau_url = '/views/' + $scope.data.tableau_view + '?:embed=yes&:toolbar=no'
          else
              tableau_url = '/t/' + $scope.data.tableau_site + '/views/' + $scope.data.tableau_view + '?:embed=yes&:toolbar=no'
          url = "https://data.travelplanet.fr/trusted/" + $scope.data.token + tableau_url
          return url
      #
      isMessage = (txt, msg) ->
          txt.substring(0, msg.length) == msg

      $scope.loadingText    = "Chargement de la vue en cours ..."
      $scope.urlLoadingView = "modals/loadingView.html"
      getTableau = () ->
          url = $scope.trustHtml()
          LOADED_INDICATOR   = 'tableau.loadIndicatorsLoaded'
          COMPLETE_INDICATOR = 'tableau.completed'
          placeholder        = document.getElementById('divMahefa')
          vizLoaded          = false
          url                = url
          tableauOptions     =
              hideTabs: true
              width:  "100%"
              height: $scope.tableauData.embed_height
              onFirstInteractive: () ->
                  $scope.display = "block"
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
