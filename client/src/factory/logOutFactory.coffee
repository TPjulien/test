tableau
.factory 'logoutFct', (SweetAlert, $location, store) ->
    logOut: ->
        SweetAlert.swal {
                  title: "Deconnexion"
                  text:  "Ceci mettra fin à votre session, continuer ?"
                  type:  "warning"
                  showCancelButton: true
                  confirmButtonColor: "#DD6B55"
                  confirmButtonText: "Deconnexion"
                  cancelButtonText: "Annuler"
                  closeOnConfirm: true
                  closeOnCancel: true
              }, (isConfirm) ->
                if isConfirm
                  if store.get 'JWT'
                      store.remove 'JWT'
                      $location.path '/login'
                  else
                      $location.path '/login'
