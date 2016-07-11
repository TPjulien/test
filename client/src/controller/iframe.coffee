tableau
.controller 'iframeCtrl', ($scope, $sce, $http) ->
      # $http
      #     method: 'POST'
      #     url:    'https://e-travelmanagement22.amadeus.com/portalApp/'
      #     headers: { 'content-type': 'application/x-www-form-urlencoded'}
      #     data:
      #         SITE:              'Q4OZQ4OZ'
      #         LANGUAGE:          'FR'
      #         LOGIN_TYPE:        'SSO'
      #         PASSWORD:          'travel2014'
      #         LOGINNAME:         'helpdesk@travelplanet.fr'
      #         BOOKING_FLOW_TYPE: 'MODIFY'
      # .success (data) ->
      #     console.log data
      # .error (err) ->
      #     console.log err
      # console.log "totootottotototo"
      # LOGINNAME: req.body.username,
      #                                                                       SITE:       'Q4OZQ4OZ',
      #                                                                       LANGUAGE:   'FR',
      #                                                                       LOGIN_TYPE: 'SSO',
      #                                                                       PASSWORD:   req.body.password,
      #                                                                       BOOKING_FLOW_TYPE: 'MODIFY'
      $http
          method: 'GET'
          url:    options.api.base_url + '/SSO'
          data:
              LOGINNAME: 'helpdesk@travelplanet.fr'
              PASSWORD:  'travel2014'
      .success (data) ->
          console.log "c'est connecté !"
          console.log data
      .error (err) ->
          console.log err
    # $scope.getMeh = () ->
    #     url =  "https://e-travelmanagement22.amadeus.com/portalApp/?SITE=Q4OZQ4OZ&LANGUAGE=FR&LOGIN_TYPE=SSO&LOGINNAME=helpdesk@travelplanet.fr&PASSWORD=travel2014&BOOKING_FLOW_TYPE=MODIFY"
    #     return $sce.trustAsResourceUrl(url)
        # console.log "dijon"
