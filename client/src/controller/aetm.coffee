tableau
.controller 'aetmCtrl', ($scope, $sce, $http, tokenFactory, store, jwtHelper, toastErrorFct,$mdDialog) ->
      getDataToken = tokenFactory.tokenData()
      site_id = getDataToken.site_id + getDataToken.site_id
      uid     = getDataToken.UID

      $http
          method : 'GET'
          url    :  'http://151.80.121.113:3005/api/aetmConnect/' + uid + '/' + site_id
          data   :
              UID   : getDataToken.UID
      .success (data) ->
          $scope.LOGINNAME  = data[0].LOGINNAME
          $scope.SITE       = data[0].SITE_ID
          $scope.LANGUAGE   = data[0].LANGUAGE
          $scope.LOGIN_TYPE = "SSO"
          $scope.PASSWORD   = data[0].PWD.replace /"/g, ""
          setTimeout (->
            document.getElementById('formSubmit').click()
          ), 0
      .error (err) ->
          console.log err
          toastErrorFct.toastError("Impossible de se connecter au serveur d'aetm, veuillez retenter plus tard")
