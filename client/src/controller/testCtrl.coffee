tableau
.controller 'testCtrl', ($scope, $http) ->
    $http
        method: 'GET'
        url:    options.api.base_url + '/test'
    .success (data) ->
        console.log data
    .error (err) ->
        console.log err

    console.log "melangé avec home !"
    # $http,
    #   METHOD: 'POST'
