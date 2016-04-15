tableau
.factory 'ipFct', (SweetAlert, $location, store, $http) ->
    insertDataIp: (action) ->
        console.log action
        $http
            method: 'POST'
            url:    options.api.base_url + '/rules/ip'
            data:
                action: action
        .success (data) ->
            true
        .error (err) ->
            false
