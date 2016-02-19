tableau
.controller 'testCtrl', ($scope, $http, $stateParams, $sce, store, jwtHelper, ticketGeneratorFactory, $interval) ->
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

    $scope.getColor = (color) ->
      css = 'background-color:' + color
      return css

    $http
        method: 'GET'
        url:    options.api.base_url + '/getViewSite/' + decode[0].site_id
    .success (result) ->
        $scope.viewMenu = result
        # console.log("hello nggah !")
        # console.log result
    .error (err) ->
        console.log err


    # /currentView/:site/:customer/:view


    # $scope.changeTemplate = () ->
    #     getDimension($scope.actualTemplate.selectUser.name)
    tiles.liveTile()


    $scope.download = (selected) ->
        id = selected[0].NUM_INVOICE
        $http
            method      : "GET"
            url         : options.api.base_url + '/downloadPDF/' + id
            responseType: 'arraybuffer'
        .success (result) ->
            myblob = new Blob([result], { type: 'application/pdf' })
            blobURL = ( window.URL || window.webkitURL).createObjectURL(myblob)
            anchor = document.createElement("a")
            anchor.download = id + '.pdf'
            anchor.href = blobURL
            anchor.click()


    # $scope.factureData = [{
    #     number: "123456"
    #     date: "15-10-1992"
    #   }, {
    #     number: "78901"
    #     date: "15-10-1992"
    #   }]
            # visualisation
            # console.log("hello !")
            # file           = new Blob([result], { type: 'application/pdf'});
            # fileUrl        = URL.createObjectURL(file)
  # <embed ng-src="{{content}}" style="width:200px;height:200px;"></embed>
            # $scope.content = $sce.trustAsResourceUrl(fileUrl)
            # $scope.content = "<embed src='" + fileUrl + "' style='width:200px;height:200px'></embed>"
            # console.log $scope.content


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
