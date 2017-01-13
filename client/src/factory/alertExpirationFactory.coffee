tableau
.factory 'alertExpirationFct', (SweetAlert, store) ->
      alertExpiration: ->
          SweetAlert.swal
              title: "Session Expirée"
              text:  "Session expirée, retour à la page de connexion"
              type:  "warning"
          store.remove('JWT')
      tokenNotFound: ->
          # SweetAlert.swal
          #     title: "Erreur de session"
          #     text:  "Imposible d'obtenir une session, veuillez vous reconnecter"
          #     type:  "warning"
      loginError: ->
          store.remove('JWT')
          SweetAlert.swal
              title: "Connexion refusée"
              text:  "Login ou mot de passe erroné, veuillez vous reconnecter"
              type:  "error"
      alertSendMail: ->
          SweetAlert.swal
              title: "Mail Envoyé!"
              text:  "Votre mail a bien été transmis à nos équipes. Nous nous engageons à vous répondre dans les plus brefs délais"
              imageUrl: "img/sendMail.gif"
