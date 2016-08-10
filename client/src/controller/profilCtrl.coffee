tableau
.controller "profilCtrl",($scope, $mdDialog, $http, NgTableParams, store, jwtHelper, $q) ->
    # data du profil
    if store.get('JWT')
      token           = store.get('JWT')
      decode          = jwtHelper.decodeToken(token)
      $scope.get_username = decode[0].username

    $scope.anotherMail           = null
    $scope.getCountryNumberphone = null
    $scope.num_phone_user        = null
    $scope.getEmail              = null
    $scope.limitOptions          = [5, 10, 15]
    $scope.selected              = []
    $scope.config                =
                                  itemsPerPage: 5
                                  fillLastPage: true
    $scope.required              = true
    uid                          =  decode[0].UID
    site_id                      =  decode[0].site_id
    community                    =  decode[0].home_community

    $scope.cardNameChange = (provider) ->
      $http
          method: 'GET'
          url: options.api.base_url + '/card_name/' + provider
      .success (data) ->
          $scope.card_name = data
      .error (err) ->
          # toas en cas d'erreur
          console.log err

    # une mise à jour de profil
    $scope.profilChange = (site_id, uid) ->
        get_profil_email           = $http.get options.api.base_url + '/profilEmail/'   + uid
        get_profil_phone           = $http.get options.api.base_url + '/profilPhone/'   + uid
        get_card_traveller         = $http.get options.api.base_url + '/cardTraveller/' + uid
        get_rail_loyalty           = $http.get options.api.base_url + '/rail_loyalty/'  + uid
        get_air_loyalty            = $http.get options.api.base_url + '/air_loyalty/'   + uid
        get_air_loyalty_air_france = $http.get options.api.base_url + '/air_loyaltyAF/' + uid
        get_profil_change          = $http.get options.api.base_url + '/profils/' + site_id + '/' + uid

        # requete plus propre et moins couteux en terme de ressource
        $q.all([
            get_profil_email
            get_profil_phone
            get_card_traveller
            get_rail_loyalty
            get_air_loyalty
            get_air_loyalty_air_france
            get_profil_change
        ]).then (data) ->
            $scope.profil_email   = data[0].data
            $scope.profil_phone   = data[1].data
            $scope.card_traveller = data[2].data
            $scope.rail_loyalty   = data[3].data
            $scope.air_loyalty    = data[4].data
            $scope.air_loyalty_af = data[5].data
            $scope.profils        = data[6].data
          .catch (err) ->
            # toast en cas d'erreur
            console.log err

    # on apelle une fois pour afficher les données avec le site_id et l'uid du cookies
    $scope.profilChange(site_id, uid)

#########################################################################
    # une v2 de tous les call qu'on dispose
    getSubData = () ->
        get_rail_class                = $http.get options.api.base_url + '/railClass'
        get_rail_wagon_code           = $http.get options.api.base_url + '/railWagonCode'
        get_rail_seat_position        = $http.get options.api.base_url + '/railSeatPosition'
        get_rail_departure_station    = $http.get options.api.base_url + '/railDepartureStation'
        get_provider                  = $http.get options.api.base_url + '/provider'
        get_rail_loyalty_program_code = $http.get options.api.base_url + '/rail_loyaltyprogramCode/'
        get_air_seating_pref          = $http.get options.api.base_url + '/airSeatingPref'
        get_country                   = $http.get options.api.base_url + '/getCountry'
        get_community                 = $http.get options.api.base_url + '/community/' + site_id
        # requete plus propre et moins couteux en terme de ressource
        $q.all([
            get_rail_class
            get_rail_wagon_code
            get_rail_seat_position
            get_rail_departure_station
            get_provider
            get_rail_loyalty_program_code
            get_air_seating_pref
            get_country
            get_community
        ]).then (data) ->
            console.log data[6].data
            $scope.rail_class                = data[0].data
            $scope.rail_wagon_code           = data[1].data
            $scope.rail_seat_position        = data[2].data
            $scope.rail_departure_station    = data[3].data
            $scope.provider                  = data[4].data
            $scope.rail_loyalty_program_code = data[5].data
            $scope.air_seating_pref          = data[6].data
            $scope.country                   = data[7].data
            $scope.community                 = data[8].data
          .catch (err) ->
            # toast en cas d'erreur
            console.log err

    getSubData()
    $scope.getusersCommunity = (site_id,community) ->
      $http
          method: 'GET'
          url:    options.api.base_url + '/usersCommunity/' + site_id + '/' + community
      .success (data) ->
          $scope.usersCommunity = data
          $scope.query =
              order: 'name'
              limit: 5
              page: 1
      .error (err) ->
          console.log err

#phone
    $scope.ajouterNum = true
    $scope.phone = false
    $scope.showPanelTel = () ->
      $scope.phone = true
      $scope.ajouterNum = false
    $scope.hidePanelTel = () ->
      $scope.phone = false
      $scope.ajouterNum = true

    $scope.listNumTel = []
    $scope.submitUserPhone = (user_phone) ->
        phoneSub = {
            phone_number : user_phone
            code_number  : $scope.getCountryNumberphone
        }
        if user_phone && $scope.getCountryNumberphone
          $scope.listNumTel.push phoneSub
          phoneSub                     = {}
          $scope.phone                 = false
          $scope.ajouterNum            = true
          $scope.getCountryNumberphone = null
          $scope.numPhoneUser          = null

    $scope.deletePhoneNumber = (id) ->
        $scope.profil_phone[id-1].PhoneNumber = ''

#Mail
    $scope.ajouterMail = true
    $scope.mail = false
    $scope.showPanelMail = () ->
      $scope.mail = true
      $scope.ajouterMail = false
    $scope.hidePanelMail = () ->
      $scope.mail = false
      $scope.ajouterMail = true

    $scope.listMail = []

    $scope.testNum = () ->
        console.log "Pays changé !"

    $scope.submitMail = (mail) ->
      mailSub = {
        mail: mail
      }
      if mail
        $scope.listMail.push mailSub
        $scope.getEmail     = ''
        $scope.mailSub     = {}
        $scope.mail        = false
        $scope.ajouterMail = true
        $scope.getEmail    = null
        mail               = null

#valideur
    $scope.ajouterValideur = true
    $scope.valideur = false
    $scope.showPanelValideur = () ->
      $scope.valideur = true
      $scope.ajouterValideur = false
    $scope.hidePanelValideur = () ->
      $scope.valideur = false
      $scope.ajouterValideur = true

    $scope.listValideur = []
    $scope.submitValideur = ->
      valideurSub = {
        name: $scope.user.nomValideur
      }
      if $scope.user.nomValideur
        $scope.listValideur.push valideurSub
        $scope.valideurSub = {}
        $scope.valideur = false
        $scope.ajouterValideur = true
        $scope.user.nameValideur = null

#Chargé de Voyage
    $scope.ajouterChargeVoy = true
    $scope.chargeVoy = false
    $scope.showPanelChargeVoy = () ->
      $scope.chargeVoy = true
      $scope.ajouterChargeVoy = false
    $scope.hidePanelChargeVoy = () ->
      $scope.chargeVoy = false
      $scope.ajouterChargeVoy = true

    $scope.listChargeVoy = []
    $scope.submitChargeVoy = ->
      chargeVoySub = {
        name: $scope.user.nomChargeVoy
      }
      if $scope.user.nomChargeVoyr
        $scope.listChargeVoy.push chargeVoySub
        $scope.chargeVoySub      = {}
        $scope.chargeVoy         = false
        $scope.ajouterChargeVoy  = true
        $scope.user.nomChargeVoy = null

#Responsable de Voyage préféré
    $scope.ajouterResponsable   = true
    $scope.responsable          = false
    $scope.showPanelResponsable = () ->
      $scope.responsable        = true
      $scope.ajouterResponsable = false
    $scope.hidePanelResponsable = () ->
      $scope.responsable        = false
      $scope.ajouterResponsable = true

    $scope.listResponsable = []
    $scope.submitResponsable = ->
      responsableSub = {
        name: $scope.user.responsable
      }
      if $scope.user.responsable
        $scope.listResponsable.push responsableSub
        $scope.responsableSub      = {}
        $scope.responsable         = false
        $scope.ajouterResponsable  = true
        $scope.user.nomResponsable = null

#Passeport
    $scope.ajouterPasseport   = true
    $scope.passeport          = false
    $scope.showPanelPasseport = () ->
      $scope.passeport        = true
      $scope.ajouterPasseport = false
    $scope.hidePanelPasseport = () ->
      $scope.passeport        = false
      $scope.ajouterPasseport = true

    $scope.listPasseport = []
    $scope.submitPasseport = ->
      passeportSub = {
        name: $scope.user.passeport
      }
      if $scope.user.passeport
        $scope.listPasseport.push passeportSub
        $scope.passeportSub      = {}
        $scope.passeport         = false
        $scope.ajouterPasseport  = true
        $scope.user.nomPasseport = null

#Carte de fidélité
    $scope.ajouterFidelite   = true
    $scope.fidelite          = false
    $scope.showPanelFidelite = () ->
      $scope.fidelite        = true
      $scope.ajouterFidelite = false
    $scope.hidePanelFidelite = () ->
      $scope.fidelite        = false
      $scope.ajouterFidelite = true

    $scope.listFidelite = []
    $scope.submitFidelite = ->
      fideliteSub = {
        name: $scope.user.fidelite
      }
      if $scope.user.fidelite
        $scope.listFidelite.push fideliteSub
        $scope.fideliteSub      = {}
        $scope.fidelite         = false
        $scope.ajouterFidelite  = true
        $scope.user.nomFidelite = null

    $scope.ajouterFideliteTrain = true
    $scope.CarteFideliteTrain   = false

    $scope.showPanelCarteFideliteTrain = () ->
      $scope.CarteFideliteTrain    = true
      $scope.ajouterFideliteTrain  = false
      $scope.TabRecupfideliteTrain = false;
    $scope.hidePanelCarteFideliteTrain = () ->
      $scope.CarteFideliteTrain    = false
      $scope.ajouterFideliteTrain  = true
      $scope.TabRecupfideliteTrain = true;

    $scope.listFideliteTrain   = []
    $scope.submitFideliteTrain = ->
      fideliteTrainSub = {
        name: $scope.user.fideliteTrain
      }
      if $scope.user.fideliteTrain
        $scope.listFidelite.push fideliteSub
        $scope.fideliteSub           = {}
        $scope.CarteFideliteTrain    = false
        $scope.ajouterFideliteTrain  = true
        $scope.user.nomFideliteTrain = null

#Carte de voyage


    $scope.ajouterCarteVoy   = true
    $scope.carteVoy          = false
    $scope.showPanelCarteVoy = () ->
      $scope.carteVoy        = true
      $scope.ajouterCarteVoy = false
      $scope.TabRecupCardVoy = false;
    $scope.hidePanelCarteVoy = () ->
      $scope.carteVoy        = false
      $scope.ajouterCarteVoy = true
      $scope.TabRecupCardVoy = true;

    $scope.listCarteVoy   = []
    $scope.submitCarteVoy = ->
      carteVoySub = {
        name: $scope.user.carteVoy
      }
      if $scope.user.carteVoy
        $scope.listCarteVoy.push carteVoySub
        $scope.carteVoySub      = {}
        $scope.carteVoy         = false
        $scope.ajouterCarteVoy  = true
        $scope.user.nomCarteVoy = null

#Carte de fidélité Hotel
    $scope.ajouterFideliteHotel   = true
    $scope.fideliteHotel          = false
    $scope.showPanelFideliteHotel = () ->
      $scope.fideliteHotel        = true
      $scope.ajouterFideliteHotel = false
    $scope.hidePanelFideliteHotel = () ->
      $scope.fideliteHotel        = false
      $scope.ajouterFideliteHotel = true

    $scope.listFideliteHotel = []
    $scope.submitFideliteHotel = ->
      fideliteHotelSub = {
        name: $scope.user.fidelite
      }
      if $scope.user.fideliteHotel
        $scope.listFideliteHotel.push fideliteHotelSub
        $scope.fideliteHotelSub      = {}
        $scope.fideliteHotel         = false
        $scope.ajouterFideliteHotel  = true
        $scope.user.nomFideliteHotel = null
#Ajouter user
    $scope.ajouterUser = false
    $scope.showPanelUser = () ->
      $scope.ajouterUser = true
    $scope.hidePanelUser = () ->
      $scope.ajouterUser = false

    toArray = (object,name) ->
        data = []
        i = 0
        while i < object.length
          if name == 'phone'
            data.push(object[i].nicename)
          else if name == 'villeGare'

            data.push(object[i].RailDepartureStation)
          i++
        return data

    toObject = (arr, name) ->

        rv = []
        i = 0
        while i < arr.length
          if name == "villeGare"
              rv[i] =
                RailDepartureStation: arr[i]
          else
              rv[i] =
                nicename: arr[i]
          ++i
        rv

    find = (key, array) ->
      # The variable results needs var in this case (without 'var' a global variable is created)
      results = []
      i       = 0
      while i < array.length
        if array[i].indexOf(key) == 0
          results.push array[i]
        i++
      results

    arrayObjectIndexOf = (object, searchTerm,name) ->
        searchTerm = searchTerm.substring(0,1).toUpperCase()+searchTerm.substring(1);
        if searchTerm
            getArray = toArray(object,name)
            result   = find(searchTerm, getArray)
            result2  = toObject(result, name)
            return result2

    $scope.getCodeNumber = (country, value) ->
      $http
          method: 'GET'
          url:    options.api.base_url + '/phoneCode/' + country
      .success (data) ->
          if data.length > 0
              $scope.getCountryNumberphone = data[0].phonecode
      .error (err) ->
          # toast en cas d'erreur
          console.log err

    $scope.querySearch = (query,name) ->
        if (name == 'villeGare')
            result = arrayObjectIndexOf($scope.rail_departure_station, query,name)
        else
            result = arrayObjectIndexOf($scope.country, query,name)
        return result
