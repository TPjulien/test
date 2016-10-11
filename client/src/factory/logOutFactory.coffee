tableau
.factory 'logoutFct', (SweetAlert, $location, store, $rootScope, $http, $window, jwtHelper, ipFct) ->
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
                      token  = store.get('JWT')
                      decode = jwtHelper.decodeToken(token)
                      is_saml = decode[0].is_saml
                      if (is_saml == false)
                          # si ce n'est pas du saml donc on logout en local
                          store.remove 'JWT'
                          $location.path '/login/account'
                      # Dans le cas contraire on va au logout de leur établissement pour le deconnecter
                      else
                          $http
                              method: 'GET'
                              url:    options.api.base_url + '/Shibboleth.sso/Logout'
                          .success (data) ->
                              store.remove 'JWT'
                              $window.location.href = data
                          .error (err) ->
                              console.log err
                      # on verifie si oui ou non c'est du saml, pour eviter de demander a chaque fois a renater
                      # $window.location.href = 'https://api.test.tp-control.travelplanet.fr/Shibboleth.sso/Logout?return=https://test.tp-control.travelplanet.fr'

                      # $location.path '/login/account'
                      # $rootScope.wallpaper = "url('https://wallpaperscraft.com/image/spots_background_light_blur_68629_1920x1080.jpg')"
                  # else
                      # $location.path '/login/account'
                      # $rootScope.wallpaper = "url('https://wallpaperscraft.com/image/spots_background_light_blur_68629_1920x1080.jpg')"
