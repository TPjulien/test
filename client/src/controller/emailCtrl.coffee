tableau
.controller 'emailCtrl', ($scope,$window,$http) ->

    $scope.sendMail = (expediteur,destinataire,objet,body) ->
        $http
            method :    'POST'
            url    :    options.api.base_url + '/sendMail'
            data   :
              expediteur:           expediteur
              destinataire :        destinataire
              objet :               objet
              body :                body
        .success (data) ->
            alertFct.alertSendMail()
        .error (err) ->
            console.log err
