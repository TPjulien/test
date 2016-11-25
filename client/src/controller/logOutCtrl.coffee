tableau
.controller 'logOutCtrl', ($scope, $location, logoutFct, toastErrorFct, ipFct) ->
      $scope.confirmLogout = () ->
          promise = logoutFactory.logOut()
          promise
          .then (data), ->
              $location.path '/login'
          .catch (err), ->
              # ajouter un toast en cas d'erreur
              toastErrorFct.toastError("Une erreur est survenue, error 500")
