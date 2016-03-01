tableau
.controller 'testCtrl', ($scope, $http, $stateParams, $sce, store, jwtHelper, ticketGeneratorFactory, $interval, $window, $filter) ->
    token                 = store.get('JWT')
    decode                = jwtHelper.decodeToken(token)
    $scope.actualTemplate = []
    $scope.viewMenu       = []
    $scope.view           = $stateParams.client
    $scope.getAllView     = null
    $scope.id             = $stateParams.id
    ticket                = null
    $scope.dataWithTicket = []
    $scope.url            = []
    $scope.url.getLength  = []
    $scope.dimension      = []
    tiles                 = $(".live-tile")
    hoverEl               = $('.tile-small')
    targetEl              = $('.blur_effect')
    $scope.menu           = [{
        id:           1
        name:         "Vue_1"
        templateName: "template de test 1"
    }, {
        id:           2
        name:         "Vue_default"
        templateName: "template par défaut"
    }]
    $scope.items = []
    $scope.test = []

    $scope.getColor = (color) ->
      css = 'background-color:' + color
      return css

    $http
        method: 'GET'
        url:    options.api.base_url + '/getViewSite/' + decode[0].site_id
    .success (result) ->
        $scope.viewMenu = result
    .error (err) ->
        console.log err


    # /currentView/:site/:customer/:view


    # $scope.changeTemplate = () ->
    #     getDimension($scope.actualTemplate.selectUser.name)
    tiles.liveTile()

    $scope.downloadPdf = (selected) ->
        $http
            method      : "GET"
            url         : options.api.base_url + '/downloadPDF/' + selected
            responseType: 'arraybuffer'
        .success (result) ->
            # console.log("niggah !")
            # console.log(result)
            myblob  = new Blob([result], { type: 'application/pdf' })
            blobURL = ( window.URL || window.webkitURL).createObjectURL(myblob)
            anchor  = document.createElement("a")
            anchor.download = selected + '.pdf'
            anchor.href = blobURL
            anchor.click()

    $scope.watchPdf = (selected) ->
        # console.log selected
        # id = selected[0].NUM_INVOICE
        $http
            method      : "GET"
            url         : options.api.base_url + '/downloadPDF/' + selected
            responseType: 'arraybuffer'
        .success (result) ->
            file           = new Blob([result], { type: 'application/pdf'})
            fileUrl        = URL.createObjectURL(file)
            # <embed ng-src="{{content}}" style="width:200px;height:200px;"></embed>
            $window.open(fileUrl,'C-Sharpcorner', 'width=600,height=800')
            # $scope.content = $sce.trustAsResourceUrl(fileUrl)
            # $scope.content = "<embed src='" + fileUrl + "' style='width:200px;height:200px'></embed>"
            console.log $scope.content
        #     console.log("niggah !")
        #     console.log(result)
        #     myblob = new Blob([result], { type: 'application/pdf' })
        #     blobURL = ( window.URL || window.webkitURL).createObjectURL(myblob)
        #     anchor = document.createElement("a")
        #     anchor.download = selected + '.pdf'
        #     anchor.href = blobURL
        #     anchor.click()


    # $scope.factureData = [{
    #     number: "123456"
    #     date: "15-10-1992"
    #   }, {
    #     number: "78901"
    #     date: "15-10-1992"
    #   }]
            # visualisation
            # console.log("hello !")



    hoverEl.on('mouseenter', () ->
        targetEl.addClass("use_blur")
        hoverEl.addClass("use_blur")
        hoverEl
        .css({'-webkit-filter': 'blur(5px)'
        })
        $(this).css({'-webkit-filter': 'blur(0px)'})
    )

    hoverEl.on('mouseleave', () ->
        targetEl.removeClass("use_blur")
        hoverEl.removeClass("use_blur")
        hoverEl
        .css({'-webkit-filter': 'blur(0px)'
        })
    )

    getTemplate = (site_id, view_id) ->
        $http
            method: 'GET'
            url:    options.api.base_url + '/currentView/' +  decode[0].tableau_user_id + '/' + decode[0].site + '/' + site_id + '/' + view_id
        .success (result) ->
            $scope.getAllView = result
        .error (err) ->
            console.log err

    if $stateParams.id == 'default'
        getTemplate(3, 1)
    else
        getTemplate($scope.view, $scope.id)

    $scope.set_height = (height) ->
        if height
            return { height : height }
        else
            height = { height : "500px" }

    $scope.trustHtml = (token, link) ->
        return $sce.trustAsResourceUrl("http://data.travelplanet.fr/trusted/" + token + link + '&:toolbar=no' )


    $scope.users = []


    # $scope.download = (selected) ->
    #     console.log selected

    requestFacture = (min, max) ->
      $http
          method: 'GET'
          url:    options.api.base_url + "/getPDF/" + min + "/" + max
      .success (result) ->
          console.log result[0].TOTAL_AMOUNT
          number = 0
          # console.log result
          # $scope.status = "Afficher plus de facture"
          while number < result.length
            $scope.data.push ({num: result[number]})
            number++
          # $scope.loadMore()
      .error (err) ->
          console.log err

    $scope.data = []
    counter = 0
    $scope.loadMore = ->
        console.log $scope.information
        if $scope.information
            console.log "ne pas utiliser des requettes"
        else if (counter == 0)
            requestFacture($scope.data.length, $scope.data.length + 50)
            counter += 50
        else
            console.log(counter)
            requestFacture(counter, counter + 20)
            counter += 20

    # requestFacture(0, 20)

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

    $scope.convertFacType = (type) ->
      typeTranslated = undefined
      if type == "CommercialInvoice"
          typeTranslated = "Facture"
      else if type == "CreditNoteGoodsAndServices"
          typeTranslated = "Avoir"
      else
          typeTranslated = "Donnée indisponible"

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

    $scope.convertDate = (date) ->
      console.log date
      # currentDate = date
      # currentDate = $filter('date')(date, "dd/MM/yyyy");
      # console.log currentDate
      # newDate = "date a corriger"

    $scope.getColor = (type) ->
      color: undefined
      if type == "CommercialInvoice"
          color = "color: #2196F3"
      else
          color = "color: #F44336"


    $scope.getFilter = (type) ->
      console.log type

    $scope.$watch 'test', (tmpStr) ->
        # $scope.information = "meh !"
        if (tmpStr.length >= 3 && !isNaN(tmpStr))
          $http
            method: 'GET'
            url:    options.api.base_url + '/pdfFilter/' + tmpStr + '/0/50'
          .success (data) ->
            console.log data
            # $scope.information = data
            $scope.data        = []
            number             = 0
            $scope.information = data.length + " résultats trouvé"
            while number < data.length
              $scope.data.push ({num: data[number]})
              number++
          .error (err) ->
            console.log err
        else if (tmpStr.length == 0)
          console.log "ça passe par la !"
          counter     = 0
          $scope.data = []
          $scope.loadMore()
          # $scope.information = "Trop court !"
          # console.log "trop court !"
        # $scope.test = tmpStr
        # console.log(tmpStr)
