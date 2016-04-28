tableau
.controller 'loginVerifyCtrl', ($http, $location, $scope, $mdDialog) ->
    $scope.background_image_url = '/img/default_account_wallpaper.jpg'
    $scope.user_image_url       = '/img/travel_planet_logo.png'
    $scope.stepVerify = (ev) ->
        $mdDialog.show
          controller:          'loadingCtrl'
          templateUrl:         'modals/loading.html'
          parent:              angular.element(document.body)
          clickOutsideToClose: false
          escapeToClose:       false
        $location.path '/login/verify/' + $scope.username
