tableau
.controller 'accountVerifyCtrl', ($scope, $location, $stateParams, $mdDialog, $http) ->
    $scope.data = []
    $http
      method: 'POST'
      url:    options.api.base_url + '/verify'
      data:
          username: $stateParams.username
    .success (data) ->
        $scope.data = data
    .error (err) ->
        console.log err
    console.log $stateParams.username
    $scope.name = $stateParams.username
    $scope.backtoLoggin = () ->
        $location.path "/login/account"

    $scope.user_image_url = 'https://media.licdn.com/mpr/mpr/shrinknp_200_200/p/3/005/082/37d/3e8b4a2.jpg'
    $scope.background_image_url = 'https://lh4.ggpht.com/nyp1JUkjVXcBTsEdWJxuNq_-h1-yqPvHJodynvQAySJsUqllkm1ZE9G5F5px2Vr1n7Tj=h900'
