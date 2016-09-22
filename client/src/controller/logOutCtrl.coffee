tableau
.controller 'logOutCtrl', ($scope, $location, ngDialog, logoutFct, toastErrorFct) ->
      $scope.confirmLogout = () ->
          promise = logoutFactory.logOut()
          promise
          .then (data), ->
              $location.path '/login'
              ngDialog.close()
          .catch (err), ->
              # ajouter un toast en cas d'erreur
              toastErrorFct.toastError("Une erreur est survenue, error 500")
