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
          console.log data
          $scope.LOGINNAME  = data[0].LOGINNAME
          $scope.SITE       = data[0].SITE_ID
          $scope.LANGUAGE   = data[0].LANGUAGE
          $scope.LOGIN_TYPE = "SSO"
          $scope.PASSWORD   = data[0].PWD
          setTimeout (->
            document.getElementById('formSubmit').click()
          ), 0
      .error (err) ->
          console.log err

      # trouver un moyen plus simple
