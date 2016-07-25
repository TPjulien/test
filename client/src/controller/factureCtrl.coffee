tableau
.controller 'factureCtrl', ($scope, $http, jwtHelper, store, $window, $filter) ->
    token              = store.get('JWT')
    search_type         = "none"
    search_num_commande = "none"
    search_num_invoice  = "none"
    search_name         = "none"
    search_price_min    = 0
    search_price_max    = 10000
    search_date_min     = "none"
    search_date_max     = "none"
    counter             = 0
    min_slider          = 0
    max_slider          = 0
    value               = 50
    decode              = jwtHelper.decodeToken(token)

    $scope.tototo = (min, max) ->
        search_price_min = min
        search_price_max = max
        $scope.data      = []
        counter          = 0
        $scope.testFacture(0, 50)

    $scope.downloadPdf = (selected) ->
        $http
            method      : "GET"
            url         : options.api.base_url + '/downloadPDF/' + selected
            responseType: 'arraybuffer'
        .success (result) ->
            myblob  = new Blob([result], { type: 'application/pdf' })
            blobURL = ( window.URL || window.webkitURL).createObjectURL(myblob)
            anchor  = document.createElement("a")
            anchor.download = selected + '.pdf'
            anchor.href = blobURL
            anchor.click()

    $scope.watchPdf = (selected) ->
        $http
            method      : "GET"
            url         : options.api.base_url + '/downloadPDF/' + selected
            responseType: 'arraybuffer'
        .success (result) ->
            file           = new Blob([result], { type: 'application/pdf'})
            fileUrl        = URL.createObjectURL(file)
            $window.open(fileUrl,'C-Sharpcorner', 'width=600,height=800')

    $scope.getValues = (min, max) ->
        if min < 1000 || max < 1000
            $scope.slider.options.step = 50
        else if min > 1000 && min < 3000 || max > 1000 && max < 3000
            $scope.slider.options.step = 200
        else
            $scope.slider.options.step = 500

    $scope.slider =
        min: 0
        max: 5000
        options:
            floor:    0
            ceil:     5000
            interval: 1000
            step:     value
            translate: (value) ->
                value + '€'
            onChange: () ->
              $scope.getValues($scope.slider.min, $scope.slider.max)
            onEnd: () ->
              $scope.tototo($scope.slider.min, $scope.slider.max)

    $scope.convert = (number) ->
        numberValue = number
        numberValue.toFixed(2)

    $scope.getColor = (color) ->
      css = 'background-color:' + color
      return css


    getFilter = () ->
        $http
            method: "GET"
            url:    options.api.base_url + '/rules/' + decode[0].site_id + '/' + decode[0].user_id
        .success (data) ->
            $scope.allow_filters.rules_filter_canFilterDate         = Boolean(+data[0].rules_filter_canFilterDate)
            $scope.allow_filters.rules_filter_canFilterNameClient   = Boolean(+data[0].rules_filter_canFilterNameClient)
            $scope.allow_filters.rules_filter_canFilterNumberClient = Boolean(+data[0].rules_filter_canFilterNumberClient)
            $scope.allow_filters.rules_filter_canFilterPRice        = Boolean(+data[0].rules_filter_canFilterPRice)
            $scope.allow_filters.rules_filter_canFilterType         = Boolean(+data[0].rules_filter_canFilterType)
        .error (err) ->
            console.log err

    getFilter()

    $scope.testFacture = (min, max) ->
        $http
          method: "GET"
          url: options.api.base_url + '/pdfSearchFilter/' + search_type + '/' + search_num_invoice + '/' + search_price_min + '/' + search_price_max + '/' + min + '/' + max + '/' + search_name + '/' + search_date_min + '/' + search_date_max + '/' + search_num_commande
        .success (result) ->
          number  = 0
          while number < result.length
            $scope.data.push ({num: result[number]})
            number++
          counter = result.length
        .error (err) ->
          console.log err

    $scope.loadMore = ->
        if $scope.information
        else if (counter == 0)
            $scope.testFacture($scope.data.length, $scope.data.length + 50)
            counter += 50
        else
            $scope.testFacture(counter, counter + 20)
            counter += 20

    $scope.getTypeFilter = (type) ->
        search_type = type
        $scope.data = []
        counter     = 0
        $scope.testFacture(0, 50)

    $scope.filterCommande = (num_commande) ->
        if num_commande != undefined
          if (num_commande.length == 0)
            search_num_commande = "none"
            $scope.data         = []
            counter             = 0
            $scope.testFacture(0, 50)
          else
            search_num_commande = num_commande
            $scope.data = []
            counter     = 0
            $scope.testFacture(0, 50)

    $scope.filterFacture = (tmpStr) ->
        if tmpStr != undefined
          if (tmpStr.length == 0)
            search_num_invoice = "none"
            $scope.data        = []
            counter            = 0
            $scope.testFacture(0, 50)
          else
            search_num_invoice = tmpStr
            $scope.data        = []
            counter            = 0
            $scope.testFacture(0, 50)

    $scope.filterName = (tmpStr) ->
        if tmpStr != undefined
          if (tmpStr.length == 0)
              search_name = "none"
              $scope.data = []
              counter     = 0
              $scope.testFacture(0, 50)
          else
              search_name = tmpStr
              $scope.data = []
              counter     = 0
              $scope.testFacture(0, 50)

    $scope.filterDate = (start, end) ->
      search_date_min = $filter('date')(start._d, "yyyy-MM-dd")
      search_date_max = $filter('date')(end._d,   "yyyy-MM-dd")
      $scope.data     = []
      counter         = 0
      $scope.testFacture(0, 50)
      if start._d.length == 0 && end._d.length == 0
          $scope.data = []
          counter     = 0
          search_date_min = "none"
          search_date_max = "none"
          $scope.testFacture(0, 50)

    $scope.checkName = (name) ->
      if !name
          newName = "Information indisponible"
      else
          newName = name

    $scope.getColor = (type) ->
      color: undefined
      if type == "CommercialInvoice"
          color = "color: #2196F3"
      else
          color = "color: #F44336"

    $scope.menuOptions = [
      [
        'Voir'
        ($itemScope) ->
          facture = $itemScope.facture.num.NUM_INVOICE
          $scope.watchPdf(facture)
      ]
      null
      [
        'Telecharger'
        ($itemScope) ->
          facture = $itemScope.facture.num.NUM_INVOICE
          $scope.downloadPdf(facture)
      ]
    ]

    $scope.getColorFactureType = (type) ->
      color = undefined
      if type == null
        color = "color: #F44336"

    $scope.convertSupplier = (suplier) ->
        translated = undefined
        if suplier == null
          translated = "Information indisponible"
        else
          translated = suplier

    $scope.convertFacType = (type) ->
      typeTranslated = undefined
      if type == "CommercialInvoice"
          typeTranslated = "Facture"
      else if type == "CreditNoteGoodsAndServices"
          typeTranslated = "Avoir"
      else
          typeTranslated = "Donnée indisponible"

    $scope.testFacture(0, 40)
