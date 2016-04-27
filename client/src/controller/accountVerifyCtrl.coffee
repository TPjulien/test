tableau
.controller 'accountVerifyCtrl', ($scope, $location) ->
    $scope.backtoLoggin = () ->
        $location.path "/login/account"
    
    $scope.user_image_url       = 'http://demo.dnnrox.com/Portals/_default/Skins/Flatna/img/icons/user@2x.png'
    $scope.background_image_url = 'https://lh4.ggpht.com/nyp1JUkjVXcBTsEdWJxuNq_-h1-yqPvHJodynvQAySJsUqllkm1ZE9G5F5px2Vr1n7Tj=h900'
