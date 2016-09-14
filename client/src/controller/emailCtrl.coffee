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
    .error (err) ->
        console.log err

    $http
        method :    'GET'
        url    :    options.api.base_url + '/profilEmail/'   + uid
    .success (data) ->
        $scope.profilEmails = data
    .error (err) ->
        console.log err

    $scope.sendMail = (expediteur,destinataire,objet,body) ->
        console.log body
        $http
            method :    'POST'
            url    :    options.api.base_url + '/sendMail'
            data   :
              expediteur:           expediteur
              destinataire :        destinataire
              objet :               objet
              body :                body
        .success (data) ->
              $http
                  method :    'POST'
                  url    :    options.api.base_url + '/putHistoryMail'
                  data   :
                    SITE_ID :             site_id
                    UID :                 uid
                    expediteur:           expediteur
                    destinataire :        destinataire
                    objet :               objet
                    body :                body
              .success (data) ->
                  alertFct.alertSendMail()
              .error (err) ->
                  console.log err
        .error (err) ->
            console.log err
