tableau
.controller 'emailCtrl', ($scope,$location,$window,$http,alertFct,store,$sce, jwtHelper) ->
    token                    = store.get('JWT')
    decode                   = jwtHelper.decodeToken(token)
    site_id                  =  decode[0].site_id
    uid                      =  decode[0].UID
    $scope.goTo = (id) ->
      # a mettre pour plus tard
      # $mdSidenav('left').close()
      path = '/home/billet/' + id
      $location.path path
    $scope.customMenu = [
          [
            'bold'
            'italic'
            'underline'
            'strikethrough'
          ]
          [
            'font-color'
            'hilite-color'
          ]
          [ 'remove-format' ]
          [
            'ordered-list'
            'unordered-list'
            'outdent'
            'indent'
          ]
          [
            'left-justify'
            'center-justify'
            'right-justify'
          ]
          [
            'code'
            'quote'
            'paragraph'
          ]
          [
            'link'
            'image'
          ]
          [ 'format-block' ]
          [ 'font' ]
          [ 'font-size' ]
        ]
    $http
        method :    'GET'
        url    :    options.api.base_url + '/infoMail/' + site_id
    .success (data) ->
        $scope.infoMails = data
    .error (err) ->
        console.log err

    $scope.infoReponse = (billet_id) ->
        $http
            method :    'GET'
            url    :    options.api.base_url + '/infoReponse/' + site_id + '/' + uid + '/' + billet_id
        .success (data) ->
            $scope.infoReponses = data
        .error (err) ->
            console.log err

    $http
        method :    'GET'
        url    :    options.api.base_url + '/profilEmail/'   + uid
    .success (data) ->
        $scope.profilEmails = data
    .error (err) ->
        console.log err
    $scope.showReponse = false
    $scope.displayreponse = () ->
        $scope.showReponse = true

    $scope.sendMail = (expediteur,destinataire,objet,body) ->
      if ( expediteur != undefined  && objet != undefined && body != undefined)
        console.log objet
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
                      SITE_ID :               site_id
                      UID :                   uid
                      email_sender:           expediteur
                      email_destination :     destinataire
                      email_title :           objet
                      email_body :            body
              .success (data) ->
                  alertFct.alertSendMail()
              .error (err) ->
                  console.log err
        .error (err) ->
            console.log err


    $scope.getBillets = () ->
        $http
            method :    'GET'
            url    :    options.api.base_url + '/getBillets/' + site_id + '/' + uid
        .success (data) ->
            $scope.billets = data
            console.log data
        .error (err) ->
            console.log err


    $scope.showMails = false
    $scope.displayMails = () ->
      $scope.showMails = true

    $scope.getMailsByBillet = (billet_id) ->
          $http
              method :    'GET'
              url    :    options.api.base_url + '/getMailsByBillet/' + site_id + '/' + uid + '/' + billet_id
          .success (data) ->
              $scope.mails = data
          .error (err) ->
              console.log err
    $scope.to_trusted = (html_code) ->
        $sce.trustAsHtml html_code

    $scope.sendMail_reponse = (expediteur,destinataire,objet,body,billet_id) ->
      if ( expediteur != undefined  && objet != undefined && body != undefined)
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
                  url    :    options.api.base_url + '/putHistoryMail_reponse'
                  data   :
                      SITE_ID :               site_id
                      UID :                   uid
                      BILLET_ID:              billet_id
                      email_sender:           expediteur
                      email_destination :     destinataire
                      email_title :           objet
                      email_body :            body
              .success (data) ->
                  $scope.showReponse = false
                  $scope.getMailsByBillet(billet_id)
                  alertFct.alertSendMail()
              .error (err) ->
                  console.log err
        .error (err) ->
            console.log err
