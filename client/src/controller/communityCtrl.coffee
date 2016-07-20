tableau
.controller 'communityCtrl', ($scope, $stateParams, $http, $location) ->
    username = $stateParams.username
    $http
        method: 'GET'
        url:    options.api.base_url + '/loginProfils/' + username
    .success (data) ->
        console.log data
        $scope.communities = data
    .error (err) ->
        console.log err

    $scope.goToPassword = (data) ->
        $location.path '/login/verify/' + data.Login + '/' + data.SITE_ID
