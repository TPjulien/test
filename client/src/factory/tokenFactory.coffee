tableau
.factory 'tokenFactory', (store, jwtHelper) ->
    tokenData: () ->
        token  = store.get('JWT')
        decode = jwtHelper.decodeToken(token)
        return decode[0]
