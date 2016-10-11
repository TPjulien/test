tableau
.controller 'loginCtrl', ($scope, $location, jwtHelper, store, $state, ipFct) ->
    if(store.get('JWT'))
        if jwtHelper.isTokenExpired(store.get('JWT'))
            store.remove 'JWT'
            $state.go 'login.account'
        else
            get_action = "Logged with click"
            ipFct.insertDataIp(get_action, false)
            $state.go 'home'
    else
        get_action = "user back"
        ipFct.insertDataIp(get_action, false)
        $state.go 'login.account'
