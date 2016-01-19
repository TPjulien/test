tableau
.controller 'testCtrl', ($scope, $http, $stateParams) ->
    $scope.ticket = $stateParams.ticket
    # $http
    #     method: 'GET'
    #     url:    options.api.base_url + '/test'
    # .success (data) ->
    #     console.log data
    # .error (err) ->
    #     console.log err
    # $http,
    #   METHOD: 'POST'
