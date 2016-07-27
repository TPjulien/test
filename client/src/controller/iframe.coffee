tableau
.controller 'iframeCtrl', ($scope, $sce, $http) ->
      $scope.LOGINNAME  = "helpdesk@travelplanet.fr"
      $scope.SITE       = "Q4OZQ4OZ"
      $scope.LANGUAGE   = "FR"
      $scope.LOGIN_TYPE = "SSO"
      $scope.PASSWORD   = "travel2014"
      setTimeout (->
        document.getElementById('formSubmit').click()
      ), 0
      # value = angular.element(document.querySelector('#formSubmit'))
      # # value.triggerHandler('#formSubmit')
      # console.log value.ready()
      # value.ready = ->
      #     console.log('click !')
      # console.log value
      # $(document).ready ->
      #   test = document.getElementById('formSubmit')
      #   console.log test
      #   test.click()
        # console.log test
        # console.log("DOM is ready")
