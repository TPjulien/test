tableau
.controller 'listTableauCtrl', ($scope, $http, store, jwtHelper, $stateParams, $location, $window) ->
    console.log("hello !")
    token                 = store.get('JWT')
    decode                = jwtHelper.decodeToken(token)
    $scope.firstname      = decode[0].firstname
    $scope.lastname       = decode[0].lastname
    $scope.favorite_color = decode[0].favorite_color
    $scope.company        = decode[0].company
    $scope.dataEmbed      = []

    trustHtml = (token, link) ->
        url = "https://data.travelplanet.fr/trusted/" + token + link + '&:toolbar=no'
        return url

    isMessage = (txt, msg) ->
        txt.substring(0, msg.length) == msg

    $scope.loadingText    = "Chargement de la vue en cours ..."
    $scope.urlLoadingView = "modals/loadingView.html"
    $scope.BI = () ->
          console.log "c'est par ici la BI !"
          $http
              method: 'GET'
              url:    options.api.base_url + '/getTemplateView/' +  decode[0].tableau_user_id + '/' + decode[0].site + '/' + $stateParams.client + '/' + $stateParams.id + '/' +  $stateParams.embed  + '/' + decode[0].user_auth
          .success (result) ->
              $scope.dataEmbed = result
              # viz.dispose()
              url = trustHtml($scope.dataEmbed.token, $scope.dataEmbed.path_to_view)
              LOADED_INDICATOR   =   'tableau.loadIndicatorsLoaded'
              COMPLETE_INDICATOR =   'tableau.completed'
              ANOTHER_LOADING   =   'api.success'
              placeholder = document.getElementById('mahefa')
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
                  if (isMessage(msg.data, LOADED_INDICATOR))
                      vizLoaded      = true
                      $scope.display = "none"
                  else if isMessage(msg.data, COMPLETE_INDICATOR)
                      if vizLoaded
                          $scope.display = "block"
                          viz.dispose()
                      else
                          $scope.urlLoadingView = "modals/errorLoading.html"
                          $scope.loadingText    = "Impossible de charger cette vue"
                          $scope.display        = "none"
              )
          .error (err) ->
              console.log(err)
