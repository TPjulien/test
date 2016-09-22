tableau
.controller 'aetmCtrl', ($scope, $sce, $http, tokenFactory, store, jwtHelper) ->
      getDataToken = tokenFactory.tokenData()
      site_id = getDataToken.site_id
      uid = getDataToken.UID

      $http
          method : 'GET'
          url    : options.api.base_url + '/aetmConnect/' + uid
          data   :
              UID   : getDataToken.UID
      .success (data) ->
          console.log 'data'
          console.log data
          $scope.getParamAetm = data
      .error (err) ->
          console.log err

      # trouver un moyen plus simple
      $scope.LOGINNAME  = "lauriers"
      $scope.SITE       = "R4QVR4QV"
      $scope.LANGUAGE   = "FR"
      $scope.LOGIN_TYPE = "SSO"
      $scope.PASSWORD   = "lauriers2016"
      setTimeout (->
        document.getElementById('formSubmit').click()
      ), 0
