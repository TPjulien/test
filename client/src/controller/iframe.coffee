tableau
.controller 'iframeCtrl', ($scope, $sce, $http, tokenFactory) ->
      getDataToken = tokenFactory.tokenData()

      # getAetm = () ->
      #     $http
      #         method : 'POST'
      #         url    : options.api.base_url + '/aetmConnect'
      #         data   :
      #             site_id : getDataToken.site_id
      #             user    : getDataToken
      #     .success (data) ->
      #         console.log data
      #     .error (err) ->
      #         console.log err
      # console.log getDataToken

      # trouver un moyen plus simple
      $scope.LOGINNAME  = "johann"
      $scope.SITE       = "Q1CNQ1CN"
      $scope.LANGUAGE   = "FR"
      $scope.LOGIN_TYPE = "SSO"
      $scope.PASSWORD   = "BruceLee27!"
      setTimeout (->
        document.getElementById('formSubmit').click()
      ), 0

      # $scope.LOGINNAME  = "voyageur1@BRGM.fr"
      # $scope.SITE       = "travel2016"
      # $scope.LANGUAGE   = "FR"
      # $scope.LOGIN_TYPE = "SSO"
      # $scope.PASSWORD   = "BruceLee27!"
      # setTimeout (->
      #   document.getElementById('formSubmit').click()
      # ), 0

      # $scope.LOGINNAME  = "helpdesk@travelplanet.fr"
      # $scope.SITE       = "Q4OZQ4OZ"
      # $scope.LANGUAGE   = "FR"
      # $scope.LOGIN_TYPE = "SSO"
      # $scope.PASSWORD   = "travel2014"
      # setTimeout (->
      #   document.getElementById('formSubmit').click()
      # ), 0
