tableau
.controller 'iframeCtrl', ($scope, $sce, $http) ->
      console.log 'meh !'
      # $http.jsonp baseurl + 'country=uk&pretty=1&action=search_listings&place_name=london' + encoding + type + '&callback=JSON_CALLBACK'

      # settings =
      #   'async': true
      #   'crossDomain': false
      #   'url': 'https://e-travelmanagement22.amadeus.com/portalApp/'
      #   'method': 'POST'
      #   'headers':
      #     'cache-control': 'no-cache'
      #     'content-type': 'application/x-www-form-urlencoded'
      #   'data':
      #     'SITE': 'Q4OZQ4OZ'
      #     'LANGUAGE': 'FR'
      #     'LOGIN_TYPE': 'SSO'
      #     'LOGINNAME': 'helpdesk@travelplanet.fr'
      #     'PASSWORD': 'travel2014'
      #     'BOOKING_FLOW_TYPE': 'MODIFY'
      # $.ajax(settings).done (response) ->
      #   console.log " putain "
      #   console.log response

      # $http
      #     method: 'JSONP'
      #     url:    'https://e-travelmanagement22.amadeus.com/portalApp/?SITE=Q4OZQ4OZ&LANGUAGE=FR&LOGIN_TYPE=SSO&LOGINNAME=helpdesk%40travelplanet.fr&PASSWORD=travel2014&BOOKING_FLOW_TYPE=MODIFY'
      # .success (data) ->
      #     console.log data
      # .error (err) ->
      #     console.log err

      # $scope.url = null
      # $http
      #     method: 'GET'
      #     url:    'http://151.80.121.123:3001/api/SSO'
      # .success (data) ->
      #     $scope.url = $sce.trustAsResourceUrl(data)
      # .error (err) ->
      #     console.log err
      # console.log "totootottotototo"
      # LOGINNAME: req.body.username,
      #                                                                       SITE:       'Q4OZQ4OZ',
      #                                                                       LANGUAGE:   'FR',
      #                                                                       LOGIN_TYPE: 'SSO',
      #                                                                       PASSWORD:   req.body.password,
      #                                                                       BOOKING_FLOW_TYPE: 'MODIFY'
      # $http
      #     method: 'GET'
      #     url:    options.api.base_url + '/SSO'
      #     data:
      #         LOGINNAME: 'helpdesk@travelplanet.fr'
      #         PASSWORD:  'travel2014'
      # .success (data) ->
      #     console.log "c'est connecté !"
      #     console.log data
      # .error (err) ->
      #     console.log err
    # $scope.getMeh = () ->
    #     url =  "https://e-travelmanagement22.amadeus.com/portalApp/?SITE=Q4OZQ4OZ&LANGUAGE=FR&LOGIN_TYPE=SSO&LOGINNAME=helpdesk@travelplanet.fr&PASSWORD=travel2014&BOOKING_FLOW_TYPE=MODIFY"
    #     return $sce.trustAsResourceUrl(url)
        # console.log "dijon"
