tableau
.controller 'emailCtrl', ($scope,$window,$http,alertFct,store, jwtHelper) ->
    token                    = store.get('JWT')
    decode                   = jwtHelper.decodeToken(token)
    site_id                  =  decode[0].site_id
    uid                      =  decode[0].UID

    $http
        method :    'GET'
        url    :    options.api.base_url + '/infoMail/' + site_id
    .success (data) ->
        $scope.infoMails = data
        console.log data
    .error (err) ->
        console.log err
    console.log uid

    $http
        method :    'GET'
        url    :    options.api.base_url + '/profilEmail/'   + uid
    .success (data) ->
        $scope.profilEmails = data
        console.log data
    .error (err) ->
        console.log err



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
            console.log('hey')
            alertFct.alertSendMail()
        .error (err) ->
            console.log err
