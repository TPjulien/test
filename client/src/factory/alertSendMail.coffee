tableau
.factory 'alertFct', (SweetAlert, store) ->
      alertSendMail: ->
          SweetAlert.swal
              title: "Mail Envoyé!"
              text:  "Votre mail a bien été transmis à nos équipes. Nous nous engageons à vous répondre dans les plus brefs délais"
              imageUrl: "img/sendMail.gif"
