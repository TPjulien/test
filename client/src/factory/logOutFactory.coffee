tableau
.factory 'logoutFct', (SweetAlert, $location, store, $rootScope, $http, $window) ->
    logOut: ->
        SweetAlert.swal {
                  title: "Déconnexion"
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

                      # $window.location.href = 'https://api.test.tp-control.travelplanet.fr/Shibboleth.sso/Logout?return=https://test.tp-control.travelplanet.fr'
                      $http
                          method: 'GET'
                          url:    options.api.base_url + '/Shibboleth.sso/Logout'
                      .success (data) ->
                          console.log(data)
                          # console.log data
                          store.remove 'JWT'
                          $window.location.href = data
                      .error (err) ->
                          console.log 'ça passe par la'
                          console.log err
                      # $location.path '/login/account'
                      # $rootScope.wallpaper = "url('https://wallpaperscraft.com/image/spots_background_light_blur_68629_1920x1080.jpg')"
                  # else
                      # $location.path '/login/account'
                      # $rootScope.wallpaper = "url('https://wallpaperscraft.com/image/spots_background_light_blur_68629_1920x1080.jpg')"
