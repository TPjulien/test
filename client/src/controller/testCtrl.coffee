tableau
.controller 'testCtrl', ($scope, $http, $stateParams, $sce, store, jwtHelper, ticketGeneratorFactory, $interval) ->
    token                 = store.get('JWT')
    decode                = jwtHelper.decodeToken(token)
    $scope.actualTemplate = []
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

    $scope.changeTemplate = () ->
        # console.log $scope.actualTemplate.selectUser.name
        getDimension($scope.actualTemplate.selectUser.name)

    tiles.liveTile()

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

    getDimension = (type) ->
        $http
            method : 'GET'
            url    :  options.api.base_url + '/getOneDimension/' + decode[0].username + '/' + type
        .success (result) ->
            $scope.dimension = result
            # console.log result
        .error (err) ->
            console.log err

    getTemplate = () ->
        $http
              method: 'GET'
              url :   options.api.base_url + '/view/' + decode[0].username + '/' + decode[0].site
        .success (result) ->
              $scope.getAllView = result
              # console.log result
              # console.log $scope.getAllView.info[0]
        .error (err) ->
              console.log err

    if $stateParams.id == 'default'
        getTemplate()
        getDimension("Vue_default")
    else
        getTemplate()

    $scope.set_height = (height) ->
        if height
            return { height : height }
        else
            height = { height : "500px" }

    $scope.trustHtml = (token, link) ->
        return $sce.trustAsResourceUrl("http://data.travelplanet.fr/trusted/" + token + '/' + link + '&:toolbar=no' )
