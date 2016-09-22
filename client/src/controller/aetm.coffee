tableau
.controller 'aetmCtrl', ($scope, $sce, $http, tokenFactory, store, jwtHelper, toastErrorFct) ->
      getDataToken = tokenFactory.tokenData()
      site_id = getDataToken.site_id
      uid = getDataToken.UID

      $http
          method : 'GET'
          url    : options.api.base_url + '/aetmConnect/' + uid
          data   :
              UID   : getDataToken.UID
      .success (data) ->
          $scope.LOGINNAME  = data[0].LOGINNAME
          $scope.SITE       = data[0].SITE_ID
          $scope.LANGUAGE   = data[0].LANGUAGE
          $scope.LOGIN_TYPE = "SSO"
          $scope.PASSWORD   = data[0].PWD
          setTimeout (->
            document.getElementById('formSubmit').click()
          ), 0
      .error (err) ->
          toastErrorFct.toastError("Impossible de se connecter au serveur d'aetm, veuillez retenter plus tard")
