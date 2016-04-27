tableau
.controller 'loginCtrl', ($scope, $http, jwtHelper, store, auth, $location, SweetAlert, alertFct, $mdDialog, ipFct) ->
    console.log "ça passe par login "
    # $scope.background_image_url = 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/09/blue-wallpaper-38.jpg'
    # $scope.user_image_url       = 'https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAUIAAAAJDBjMWM3NDAwLWUxMjAtNDBiMy04YWM3LWFjZWY4Y2ExOWRjYg.png'
    # $scope.stepVerify = () ->
    #     $scope.user_image_url = 'http://demo.dnnrox.com/Portals/_default/Skins/Flatna/img/icons/user@2x.png'
    #     $scope.background_image_url = 'https://lh4.ggpht.com/nyp1JUkjVXcBTsEdWJxuNq_-h1-yqPvHJodynvQAySJsUqllkm1ZE9G5F5px2Vr1n7Tj=h900'
    #     console.log $scope.username
    # $scope.test =
    #   closeEl: '.close'
    #   modal:
    #     templateUrl: 'modals/loading.html'
    #     controller:   'loadingCtrl'

    $scope.login = (user, ev) ->
        $mdDialog.show
          controller:          'loadingCtrl'
          templateUrl:         'modals/loading.html'
          parent:              angular.element(document.body)
          targetEvent:         ev
          clickOutsideToClose: false
          escapeToClose:       false
        $http
            method: 'POST'
            url:    options.api.base_url + '/login'
            data: {
                username: user.username
                password: user.password
            }
        .success (data) ->
            ipFct.insertDataIp("login session")
            $mdDialog.hide()
            store.set('JWT', data.token)
            $location.path "/home"
        .error (err) ->
            alertFct.loginError()
            $mdDialog.hide()
