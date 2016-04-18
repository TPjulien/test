tableau
.factory 'alertFct', (SweetAlert, store) ->
      alertExpiration: ->
          SweetAlert.swal
              title: "Session Expiré"
              text:  "Session expiré, retour à la page de connexion"
              type:  "warning"
          store.remove('JWT')
      tokenNotFound: ->
          console.log "B1554"
          # SweetAlert.swal
          #     title: "Erreur de session"
          #     text:  "Imposible d'obtenir une session, veuillez vous reconnecter"
          #     type:  "warning"
      loginError: ->
          SweetAlert.swal
              title: "Connexion refusé"
              text:  "Login ou mot de passe éroné, veuillez vous reconnecter"
              type:  "error"
