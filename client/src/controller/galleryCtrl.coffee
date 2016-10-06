tableau
.controller 'galleryCtrl', ($scope, NgMap) ->

    $scope.getMarker    = []

    $scope.address    = null
    $scope.endAddress = null

    addressStart = []
    addressEnd   = []

    $scope.destination = null

    # $scope.types = "['establishment']"
    $scope.placeChanged = () ->
        $scope.place = this.getPlace()
        $scope.getMarker = $scope.place.geometry.location.lat() + ',' + $scope.place.geometry.location.lng()
        addressStart     = $scope.place.geometry.location
        $scope.address   = $scope.place.formatted_address
        # $scope.map.setCenter($scope.place.geometry.location)

    $scope.placeEndChanged = () ->
        $scope.place = this.getPlace()
        $scope.getMarker   = $scope.getMarker = $scope.place.geometry.location.lat() + ',' + $scope.place.geometry.location.lng()
        addressEnd         = $scope.place.geometry.location
        $scope.endAddress  = $scope.place.formatted_address
        $scope.destination = $scope.place.formatted_address

        if $scope.address != null
            getPriceInfo(addressStart, addressEnd)



    NgMap
    .getMap()
    .then (map) ->
        $scope.map = map


    getPriceInfo = (start, end) ->
        console.log 'coord start : ' , start.lat(), start.lng()
        console.log 'coord stop : '  , end.lat(), end.lng()
    # getPriceInfo = () ->
    #     $http
    #         method: 'POST'
    #         url   : null
    #         data  :
    #             start :
    #             end   :
