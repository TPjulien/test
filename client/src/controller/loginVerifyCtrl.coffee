tableau
.controller 'loginVerifyCtrl', ($http, $location, $scope, $mdDialog, store, jwtHelper, toastErrorFct, $window) ->

    if store.get('JWT')
      token           = store.get('JWT')
      decode          = jwtHelper.decodeToken(token)
      $scope.get_username = decode[0].username
      $location.path '/login/verify/' + $scope.get_username

    # $window.location.href = "https://tp-control.travelplanet.fr:3254/api/shibboleth"
    # $http
    #     method: 'GET'
    #     url:    options.api.base_url + '/loginProfils'
    # .success (data, status, headers, config) ->
    #     console.log data
        # $location.url('www.google.fr')
        # console.log data

    $scope.background_image_url = '/img/default_account_wallpaper.jpg'
    $scope.user_image_url       = '/img/travel_planet_logo.png'

    $scope.stepVerify = (ev) ->
        # $.ajax
        #   type: 'GET'
        #   url: 'http://151.80.121.123:3001/api/loginProfils'
        #   success: (data, textStatus, xhrreq) ->
        #     console.log xhrreq
        #     if data.redirect
        #
        #        window.location.href = data.redirect;
              # console.log "redirect !"
              # data.redirect contains the string URL to redirect to
              # window.location.href = data.redirect
            # else
              # console.log textStatus
              # console.log data
              #  window.location.href = data.redirect;
              # console.log "meh !"
              # data.form contains the HTML for the replacement form
              # $('#myform').replaceWith data.form
        # settings =
        #   'async': true
        #   'crossDomain': true
        #   'url': 'http://151.80.121.123:3001/api/loginProfils'
        #   'method': 'GET'
        #   'headers':
        #
        #     'content-type': 'application/x-www-form-urlencoded'
        # $.ajax(settings).done (response) ->
        #   console.log response
        $http
            method: 'GET'
            url:    options.api.base_url + '/loginCheck/' + $scope.username
        .success (data) ->
            if (data.length == 1)
                $location.path '/login/verify/' + $scope.username + '/' + data[0].SITE_ID
            else if (data.length > 1)
                $location.path '/login/comunity/' + $scope.username
            else
                toastErrorFct.toastError("L'utilisateur : " + $scope.username + " n'existe pas")
        .error (err) ->
            console.log err
            toastErrorFct.toastError("Impossible de se connecter au serveur de login, veuillez retenter plus tard")
