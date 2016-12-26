tableau
  .controller 'tableauCtrl', ($scope, $http, $sce, $stateParams, jwtHelper, store,$mdDialog) ->
      token                 = store.get('JWT')
      decode                = jwtHelper.decodeToken(token)
      $scope.tableauToken   = []
      $scope.tableauData    = []
      $scope.tableauDisplay = "none"
      $scope.loadingDisplay = "block"
      site_id               = decode[0].site_id
      uid                   = decode[0].UID
      site_id_parse         = site_id.substr(0,4)
      user_id               = site_id_parse + uid
      $scope.loadingText    = "Chargement de la vue en cours ..."
      $scope.urlLoadingView = "modals/loadingView.html"

      # $mdDialog.show
      #   controller          : 'alertTableauCtrl'
      #   templateUrl         : 'modals/alertTableau.html'
      #   parent              : angular.element(document.body)
      #   clickOutsideToClose : false
      #   escapeToClose       : false


      $scope.init = (info) ->
          $scope.tableauData = info
          getTableauToken()

      $scope.listenToMarksSelection = () ->
        $scope.viz.addEventListener tableau.TableauEventName.MARKS_SELECTION, onMarksSelection
        return

      $scope.exportToPDF = ->
        $scope.viz.showExportPDFDialog()
        return

      onMarksSelection = (marksEvent) ->
        marksEvent.getMarksAsync().then reportSelectedMarks
      $scope.selected_data = []
      reportSelectedMarks = (marks) ->
        $scope.selected_data = []
        html = ''
        markIndex = 0
        while markIndex < marks.length
          pairs = marks[markIndex].getPairs()
          pairIndex = 0
          while pairIndex < pairs.length
            pair = pairs[pairIndex]
            obj =
              fieldName      :  pair.fieldName
              formattedValue :  pair.formattedValue
            $scope.selected_data.push obj
            pairIndex++
          markIndex++

      getTableauToken = () ->
        url = options.api.base_url + '/tokenExchange'
        $http.post url, { tableau_site : $scope.tableauData.tableau_site , user_name : user_id }
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
          placeholder        = document.getElementById($scope.info.embed_id)
          vizLoaded          = false
          url                = url
          tableauOptions     =
                  hideTabs : true
                  width : "100%"
                  height : "800px"
                  hideToolbar: true
                  onFirstInteractive: ->
                     $scope.listenToMarksSelection()
                     document.getElementById('getData').disabled = false

          $scope.viz = new tableau.Viz(placeholder, url, tableauOptions)
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
      $scope.data_get = []
      $scope.choices  = []
      $scope.getUnderlyingData = () ->
        # $scope.data_get = []
        # choice = $scope.viz.getWorkbook().getActiveSheet().getWorksheets()
        # angular.forEach choice, (value, key) ->
        #     c = value._impl.$name
        #     $scope.choices.push c
        # angular.forEach $scope.choices, (value, key) ->
          sheet  = $scope.viz.getWorkbook().getActiveSheet().getWorksheets().get("DATA") ->
          options =
              maxRows: 10
              ignoreSelection: true
              ignoreAliases: false
              includeAllColumns: false
          sheet.getUnderlyingDataAsync(options).then (t) ->
              elem =
                sheet: value
                data : t.getData()[0]
              $scope.data_get.push elem
