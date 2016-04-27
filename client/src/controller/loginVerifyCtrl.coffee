tableau
.controller 'loginVerifyCtrl', ($http, $location, $scope) ->
    $scope.background_image_url = 'http://cdn.wonderfulengineering.com/wp-content/uploads/2014/09/blue-wallpaper-38.jpg'
    $scope.user_image_url       = 'https://media.licdn.com/mpr/mpr/shrink_200_200/AAEAAQAAAAAAAAUIAAAAJDBjMWM3NDAwLWUxMjAtNDBiMy04YWM3LWFjZWY4Y2ExOWRjYg.png'
    $scope.stepVerify = () ->
        $location.path '/login/accountVerify/mahefa'
