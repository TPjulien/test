tableau
.controller 'loginCtrl', ($scope, $location, jwtHelper, store, $state) ->
    if(store.get('JWT'))
        if jwtHelper.isTokenExpired(store.get('JWT'))
            store.remove 'JWT'
            $state.go 'login.account'
        else
            $state.go 'home'
    else
        $state.go 'login.account'
