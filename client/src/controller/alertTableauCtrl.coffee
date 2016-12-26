tableau
  .controller 'alertTableauCtrl', ($scope, $http, $sce, $stateParams, jwtHelper, store) ->
        $scope.init = () ->
            getTableauToken()

        isMessage  = (txt, msg) -> txt.substring(0, msg.length) == msg
        getTableauToken = () ->
          url = options.api.base_url + '/tokenExchange'
          $http.post url, { tableau_site : "Customer", user_name : "Q1OAtravelpsup" }
          .then (data) ->
              $scope.tableauToken = data.data.token
              getTableau()
        $scope.trustHtml = () ->
            tableau_url = null
            tableau_url = '/t/' + "Customer" + '/views/getData/Sheet1?:embed=yes&:toolbar=no'
            url = "https://data.travelplanet.fr/trusted/" + $scope.tableauToken + tableau_url
            return url

        $scope.listenToMarksSelection = () ->
          $scope.viz.addEventListener tableau.TableauEventName.MARKS_SELECTION, onMarksSelection
          return

        onMarksSelection = (marksEvent) ->
          marksEvent.getMarksAsync().then reportSelectedMarks

        reportSelectedMarks = (marks) ->
          html = ''
          markIndex = 0
          while markIndex < marks.length
            pairs = marks[markIndex].getPairs()
            html += '<b>Mark ' + markIndex + ':</b><ul>'
            pairIndex = 0
            while pairIndex < pairs.length
              pair = pairs[pairIndex]
              html += '<li><b>Field Name:</b> ' + pair.fieldName
              html += '<br/><b>Value:</b> ' + pair.formattedValue + '</li>'
              pairIndex++
            html += '</ul>'
            markIndex++
          infoDiv = document.getElementById('markDetails')
          infoDiv.innerHTML = html
          return

        getTableau = () ->
            url                = $scope.trustHtml()
            LOADED_INDICATOR   = 'tableau.loadIndicatorsLoaded'
            COMPLETE_INDICATOR = 'tableau.completed'
            placeholder        =  document.getElementById("vizContainer_2")
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

        $scope.exportToPDF = ->
          $scope.viz.showExportPDFDialog()
          return

        $scope.data_get = []
        $scope.getUnderlyingData = () ->
          sheet = $scope.viz.getWorkbook().getActiveSheet()
          options =
              maxRows: 10
              ignoreSelection: true
              ignoreAliases: false
              includeAllColumns: false
          sheet.getUnderlyingDataAsync(options).then (t) ->
              table = t
              $scope.data_get = JSON.stringify(table.getData())
              tgt = document.getElementById('dataTarget')
              tgt.innerHTML = '<h4>Underlying Data:</h4><p>' + JSON.stringify(table.getData()) + '</p>'
