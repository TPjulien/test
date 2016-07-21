tableau
.controller 'listTableauCtrl', ($scope, $http, store, jwtHelper, $stateParams, $location) ->
    console.log("hello !")
    token                 = store.get('JWT')
    decode                = jwtHelper.decodeToken(token)
    # $rootScope.color      = "#EAEAEA"
    $scope.firstname      = decode[0].firstname
    $scope.lastname       = decode[0].lastname
    $scope.favorite_color = decode[0].favorite_color
    $scope.company        = decode[0].company
    $scope.dataEmbed      = []

    trustHtml = (token, link) ->
        url = "https://data.travelplanet.fr/trusted/" + token + link + '&:toolbar=no'
        return url

    # $scope.getTheView = () ->
    #     $http
    #         method: 'GET'
    #         url:    options.api.base_url + '/getTemplateView/' +  decode[0].tableau_user_id + '/' + decode[0].site + '/' + $stateParams.site_id + '/' + $stateParams.view_id + '/' +  $stateParams.embed_id  + '/' + decode[0].user_auth
    #     .success (result) ->
    #         console.log result
    #         $scope.dataEmbed = result
    #         # $scope.niggeh(result)
    #     .error (err) ->
    #         # console.log(err)
    #         $location.path '/home/error'

    # $scope.getTheView()

    isMessage = (txt, msg) ->
        txt.substring(0, msg.length) == msg

    $scope.loadingText    = "Chargement de la vue en cours ..."
    $scope.urlLoadingView = "modals/loadingView.html"
    $scope.niggeh = () ->
          $http
              method: 'GET'
              url:    options.api.base_url + '/getTemplateView/' +  decode[0].tableau_user_id + '/' + decode[0].site + '/' + $stateParams.site_id + '/' + $stateParams.view_id + '/' +  $stateParams.embed_id  + '/' + decode[0].user_auth
          .success (result) ->
              $scope.dataEmbed = result
              # viz.dispose()
              url = trustHtml($scope.dataEmbed.token, $scope.dataEmbed.path_to_view)
              LOADED_INDICATOR   =   'tableau.loadIndicatorsLoaded'
              COMPLETE_INDICATOR =   'tableau.completed'
              ANOTHER_LOADING   =   'api.success'
              placeholder = document.getElementById($scope.dataEmbed.token)
              vizLoaded   = false
              url         = url
              tableauOptions =
                  hideTabs: true
                  width:  "100%"
                  height: $scope.dataEmbed.embed_height
                  onFirstInteractive: () ->
                      $scope.show    = true
                      $scope.display = "block"
              viz = new tableau.Viz(placeholder, url, tableauOptions)
              window.addEventListener('message', (msg) ->
                  console.log msg.data
                  if (msg.data.indexOf(ANOTHER_LOADING) > -1)
                      vizLoaded      = true
                      $scope.display = "none"
                  else if isMessage(msg.data, COMPLETE_INDICATOR)
                      if vizLoaded
                          console.log "viz pris en compte !"
                          $scope.display = "block"
                          viz.dispose()
                      else
                          $scope.urlLoadingView = "modals/errorLoading.html"
                          $scope.loadingText    = "Impossible de charger cette vue"
                          $scope.display        = "none"
              )
          .error (err) ->
              console.log(err)
