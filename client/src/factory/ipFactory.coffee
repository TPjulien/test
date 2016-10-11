tableau
.factory 'ipFct', ($location, $http, store, jwtHelper) ->
    insertDataIp: (get_action, removable_token) ->
        if (store.get('JWT'))
            token                    = store.get('JWT')
            decode                   = jwtHelper.decodeToken(token)
            $.getJSON 'https://freegeoip.net/json/?callback', (data) ->
                # Partie recuperer l'addresse de la parsonne
                geo = data
                date = new Date();
                $http
                  method : 'POST'
                  url    : options.api.base_url + '/log'
                  data   :
                      ip             : geo.ip
                      country_code   : geo.country_code
                      country_name   : geo.country_name
                      region_name    : geo.region_name
                      zip_code       : geo.zip_code
                      time_zone      : geo.time_zone
                      lattitude      : geo.latitude
                      longitude      : geo.longitude
                      action         : get_action
                      user_id        : decode[0].UID
                      username       : decode[0].username
                .success (data) ->
                    if(removable_token == true)
                        store.remove 'JWT'
                        $location.path '/login/account'
                .error (err) ->
                    if(removable_token == true)
                        store.remove 'JWT'
                        $location.path '/login/account'
