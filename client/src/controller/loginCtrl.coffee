tableau
.controller 'loginCtrl', ($scope, $location, jwtHelper, store, $state, ipFct) ->
    if(store.get('JWT'))
        if jwtHelper.isTokenExpired(store.get('JWT'))
            store.remove 'JWT'
            $state.go 'login.account'
        else
            get_action = "Logged back"
            ipFct.insertDataIp(get_action)
            $state.go 'home'
    else
        $state.go 'login.account'
