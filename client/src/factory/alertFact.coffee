tableau
.factory 'alertFct', (SweetAlert,$http, $location, $state) ->
     okCreateFactory: ->
       SweetAlert.swal("Bien Joué!", "Cet élément est maintenant enregistré!", "success")
     alertSend: ->
          SweetAlert.swal
              title: "Attention !"
              text:  "L'adresse email de destination doit contenir '@travelplanet.fr' "
              imageUrl: "img/warning.svg"
