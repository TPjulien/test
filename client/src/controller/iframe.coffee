tableau
.controller 'iframeCtrl', ($scope, $sce, $http) ->
      # trouver un moyen plus simple
      $scope.LOGINNAME  = "johann"
      $scope.SITE       = "Q1CNQ1CN"
      $scope.LANGUAGE   = "FR"
      $scope.LOGIN_TYPE = "SSO"
      $scope.PASSWORD   = "BruceLee27!"
      setTimeout (->
        document.getElementById('formSubmit').click()
      ), 0

      # $scope.LOGINNAME  = "helpdesk@travelplanet.fr"
      # $scope.SITE       = "Q4OZQ4OZ"
      # $scope.LANGUAGE   = "FR"
      # $scope.LOGIN_TYPE = "SSO"
      # $scope.PASSWORD   = "travel2014"
      # setTimeout (->
      #   document.getElementById('formSubmit').click()
      # ), 0
