tableau
  .controller 'tableauCtrl', ($scope, $http, $sce) ->
      console.log "partie tableau"
      $scope.display = "none"
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

      # trustHtml = (token, link) ->
      #     url = "https://data.travelplanet.fr/trusted/" + token + link + '&:toolbar=no'
      #     return url
      #
      # isMessage = (txt, msg) ->
      #     txt.substring(0, msg.length) == msg

      # $scope.loadingText    = "Chargement de la vue en cours ..."
      # $scope.urlLoadingView = "modals/loadingView.html"
      # $scope.niggeh = (getTableau) ->
      #     if ($scope.infoList == 'list' && getTableau == "none")
      #         $http
      #             method: 'GET'
      #             url:    options.api.base_url + '/getTemplateView/' +  decode[0].tableau_user_id + '/' + decode[0].site + '/' + $stateParams.client + '/' + $stateParams.id + '/' +  $stateParams.embed  + '/' + decode[0].user_auth
      #         .success (result) ->
      #               url = trustHtml(result.token, result.path_to_view)
      #               LOADED_INDICATOR =   'tableau.loadIndicatorsLoaded'
      #               COMPLETE_INDICATOR = 'tableau.completed'
      #               placeholder = document.getElementById('mahefa')
      #               vizLoaded   = false
      #               url         = url
      #               tableauOptions =
      #                   hideTabs: true
      #                   width:  "104%"
      #                   height: result.embed_height
      #                   onFirstInteractive: () ->
      #                       $scope.show    = true
      #                       $scope.display = "block"
      #               viz = new tableau.Viz(placeholder, url, tableauOptions)
      #               window.addEventListener('message', (msg) ->
      #                   if (isMessage(msg.data, LOADED_INDICATOR))
      #                       vizLoaded      = true
      #                       $scope.display = "none"
      #                   else if isMessage(msg.data, COMPLETE_INDICATOR)
      #                       if vizLoaded
      #                           viz.dispose()
      #                           $scope.display = "block"
      #                       else
      #                           $scope.urlLoadingView = "modals/errorLoading.html"
      #                           $scope.loadingText    = "Impossible de charger cette vue"
      #                           $scope.display        = "none"
      #               )
      #         .error (err) ->
      #             console.log err
      #     else
      #         url = trustHtml(getTableau.token, getTableau.path_to_view)
      #         LOADED_INDICATOR =   'tableau.loadIndicatorsLoaded'
      #         COMPLETE_INDICATOR = 'tableau.completed'
      #         placeholder = document.getElementById(getTableau.embed_id)
      #         vizLoaded   = false
      #         url         = url
      #         tableauOptions =
      #             hideTabs: true
      #             width:  "100%"
      #             height: getTableau.embed_height
      #             onFirstInteractive: () ->
      #                 $scope.show    = true
      #                 $scope.display = "block"
      #         viz = new tableau.Viz(placeholder, url, tableauOptions)
      #         window.addEventListener('message', (msg) ->
      #             if (isMessage(msg.data, LOADED_INDICATOR))
      #                 vizLoaded      = true
      #                 $scope.display = "none"
      #             else if isMessage(msg.data, COMPLETE_INDICATOR)
      #                 if vizLoaded
      #                     viz.dispose()
      #                     $scope.display = "block"
      #                 else
      #                     $scope.urlLoadingView = "modals/errorLoading.html"
      #                     $scope.loadingText    = "Impossible de charger cette vue"
      #                     $scope.display        = "none"
      #         )
