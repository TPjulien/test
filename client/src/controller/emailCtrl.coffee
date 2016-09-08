tableau
.controller 'emailCtrl', ($scope,$window,Mailto,$http) ->

    $scope.sendMail = (destinataire,objet,body) ->
        $http
            method :    'POST'
            url    :    options.api.base_url + '/sendMail'
            data   :
              destinataire :  destinataire
              objet :         objet
              body :          body
        .success (data) ->
            $scope.data = data
        .error (err) ->
            console.log err
