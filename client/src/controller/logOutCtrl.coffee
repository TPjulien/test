tableau
.controller 'logOutCtrl', ($scope, $location, ngDialog, logoutFct) ->
      $scope.confirmLogout = () ->
          promise = logoutFactory.logOut()
          promise
          .then (data), ->
              $location.path '/login'
              ngDialog.close()
          .catch (err), ->
              console.log err
