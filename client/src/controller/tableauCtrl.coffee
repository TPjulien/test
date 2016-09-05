tableau
  .controller 'tableauCtrl', ($scope, $http, $sce, $stateParams, jwtHelper, store) ->

      token       = store.get('JWT')
      view_id     = $stateParams.id
      decode      = jwtHelper.decodeToken(token)
      $scope.show = true
      $scope.data = []

      $scope.tableauDisplay = "none"
      $scope.loadingDisplay = "block"

      site_id   = decode[0].site_id
      embed_id  = []
      splitted  = []

      # if embed_id.indexOf('-') != -1
      #     splitted = embed_id.split("-")
      #     view_id  = splitted[0]
      #     embed_id = splitted[1]

      getTableauRequest = () ->
          $http
              method : 'POST'
              url    :  options.api.base_url + '/getTableau'
              data   :
                  site_id  : site_id
                  view_id  : view_id
                  embed_id : embed_id
          .success (data) ->
              # console.log data
              $scope.data = data
              getTableau()
          .error (err) ->
              console.log err
          $scope.display = "none"

      getTableauRequest()
      # $scope.url = ""
      # $scope.lengthTableau = 0

      # getTemplate = (site_id, view_id) ->
      #     $http
      #         method: 'GET'
      #         url:    options.api.base_url + '/currentView/' +  decode[0].tableau_user_id + '/' + decode[0].site + '/' + site_id + '/' + view_id + '/' + decode[0].user_auth + '/' + decode[0].user_id
      #     .success (result) ->
      #         $scope.getAllView = result
      #         $scope.url = "templates/tableau.html"
      #     .error (err) ->
      #         $location.path '/home/error'

      # getTemplate($scope.view, $scope.id)

      # $scope.set_height = (height) ->
      #     if height
      #         return { height : height }
      #     else
      #         height = { height : "500px" }

      $scope.trustHtml = () ->
          tableau_url = null
          if $scope.data.tableau_site == "Default"
              tableau_url = '/views/' + $scope.data.tableau_view + '?:embed=yes&:toolbar=no'
          else
              tableau_url = '/t/' + $scope.data.tableau_site + '/views/' + $scope.data.tableau_view + '?:embed=yes&:toolbar=no'
          url = "https://data.travelplanet.fr/trusted/" + $scope.data.token + tableau_url
          # console.log url
          return url
      #
      isMessage = (txt, msg) ->
          txt.substring(0, msg.length) == msg

      $scope.loadingText    = "Chargement de la vue en cours ..."
      $scope.urlLoadingView = "modals/loadingView.html"
      # refaire le site
      getTableau = () ->
          # console.log("ça passe ici")
          url = $scope.trustHtml()
          LOADED_INDICATOR   = 'tableau.loadIndicatorsLoaded'
          COMPLETE_INDICATOR = 'tableau.completed'
          placeholder        = document.getElementById('divMahefa')
          vizLoaded          = false
          url                = url
          tableauOptions     =
              hideTabs: true
              width:  "100%"
              height: "800px"
              onFirstInteractive: () ->
                  $scope.display = "block"
          viz = new tableau.Viz(placeholder, url, tableauOptions)
          window.addEventListener('message', (msg) ->
              if (isMessage(msg.data, LOADED_INDICATOR))
                  vizLoaded      = true
                  $scope.display = "none"
              else if isMessage(msg.data, COMPLETE_INDICATOR)
                  console.log "c'est bon !"
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
          # else
          #     url = trustHtml(getTableau.token, getTableau.path_to_view)
          #     LOADED_INDICATOR =   'tableau.loadIndicatorsLoaded'
          #     COMPLETE_INDICATOR = 'tableau.completed'
          #     placeholder = document.getElementById(getTableau.embed_id)
          #     vizLoaded   = false
          #     url         = url
          #     tableauOptions =
          #         hideTabs: true
          #         width   : "100%"
          #         height  : getTableau.embed_height
          #         onFirstInteractive: () ->
          #             $scope.show    = true
          #             $scope.display = "block"
          #     viz = new tableau.Viz(placeholder, url, tableauOptions)
          #     window.addEventListener('message', (msg) ->
          #         if (isMessage(msg.data, LOADED_INDICATOR))
          #             vizLoaded      = true
          #             $scope.display = "none"
          #         else if isMessage(msg.data, COMPLETE_INDICATOR)
          #             if vizLoaded
          #                 viz.dispose()
          #                 $scope.display = "block"
          #             else
          #                 $scope.urlLoadingView = "modals/errorLoading.html"
          #                 $scope.loadingText    = "Impossible de charger cette vue"
          #                 $scope.display        = "none"
          #     )
