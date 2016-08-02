tableau
.controller "profilCtrl",($scope,$mdDialog,$http,$q,NgTableParams) ->
#Ajouter user
    $scope.ajouterUser = false
    $scope.showPanelUser = () ->
      $scope.ajouterUser = true
    $scope.hidePanelUser = () ->
      $scope.ajouterUser = false
    uid = 'boetschnat'

    # data du profil
    $scope.anotherMail           = null
    $scope.getCountryNumberphone = null
    $scope.numPhoneUser          = null
    $scope.getEmail              = null

    $http
        method: 'GET'
        url: options.api.base_url + '/profils/' + uid
    .success (data) ->
        $scope.profils = data[0]
        console.log   $scope.profils = data[0]
    .error (err) ->
        console.log err

# Appel pour lister toutes les class voyageur pour le train
    $http
        method: 'GET'
        url: options.api.base_url + '/railClass'
    .success (data) ->
        $scope.railClass = data
    .error (err) ->
        console.log err

# Appel pour lister tout les emplacements sièges pour le train
    $http
        method: 'GET'
        url: options.api.base_url + '/railWagonCode'
    .success (data) ->
        $scope.railWagonCode = data
    .error (err) ->
        console.log err

# Appel pour lister toutes les preferences sens de la marche train railDepartureStation
    $http
        method: 'GET'
        url: options.api.base_url + '/railSeatPosition'
    .success (data) ->
        $scope.railSeatPosition = data
    .error (err) ->
        console.log err

# Appel pour lister toutes les villes preféré de depart train
    $http
        method: 'GET'
        url: options.api.base_url + '/railDepartureStation'
    .success (data) ->
        $scope.railDepartureStation = data
    .error (err) ->
        console.log err

# Appel pour lister toutes les villes preféré de depart train
    $http
        method: 'GET'
        url: options.api.base_url + '/provider'
    .success (data) ->
        $scope.provider = data
    .error (err) ->
        console.log err

# Appel pour lister les cartes voyageur du voyageur
    $http
        method: 'GET'
        url: options.api.base_url + '/cardTraveller/' + uid
    .success (data) ->
        $scope.cardTraveller = data
        console.log $scope.cardTraveller
        if $scope.cardTraveller.length == 0
            $scope.TabRecupCardVoy = false
        else
            $scope.TabRecupCardVoy = true
    .error (err) ->
        console.log err

# Appel pour lister les carte voyageur en fonction des compagnies férrovières
    $scope.cardNameChange = (provider) ->
      $http
          method: 'GET'
          url: options.api.base_url + '/card_name/' + provider
      .success (data) ->
          $scope.card_name = data
      .error (err) ->
          console.log err

# Appel pour lister les compagnies férrovières disponible pour les cartes de fidélités
    $http
        method: 'GET'
        url:    options.api.base_url + '/rail_loyaltyprogramCode'
    .success (data) ->
        $scope.rail_loyaltyprogramCode = data
    .error (err) ->
        console.log err

# Appel pour lister les cartes de fidélité train d'un voyageur
    $http
        method: 'GET'
        url: options.api.base_url + '/rail_loyalty/' + uid
    .success (data) ->
        $scope.rail_loyalty = data
        if $scope.rail_loyalty.length == 0
            $scope.TabRecupfideliteTrain = false
        else
            $scope.TabRecupfideliteTrain = true
    .error (err) ->
        console.log err

# Appel pour lister les cartes de fidélité train d'un voyageur
    $http
        method: 'GET'
        url: options.api.base_url + '/airSeatingPref'
    .success (data) ->
        $scope.airSeatingPref = data
    .error (err) ->
        console.log err

# Appel pour lister les cartes de fidélité aérienne d'un voyageur
    $http
        method: 'GET'
        url: options.api.base_url + '/air_loyalty'
    .success (data) ->
        $scope.air_loyalty = data
    .error (err) ->
        console.log err


    $http
        method: 'GET'
        url:    options.api.base_url + '/community'
    .success (data) ->
        $scope.community = data
    .error (err) ->
        console.log err

    $scope.profilchange = (uid) ->
      $http
          method: 'GET'
          url: options.api.base_url + '/profils/' + uid
      .success (data) ->
          $scope.profils = data[0]
      .error (err) ->
          console.log err

    $scope.getusersCommunity = (number_community) ->
      $http
          method: 'GET'
          url:    options.api.base_url + '/usersCommunity/' + number_community
      .success (data) ->
          $scope.usersCommunity = data
          $scope.query =
              order: 'name'
              limit: 5
              page: 1
      .error (err) ->
          console.log err

    $http
        method: 'GET'
        url:    options.api.base_url + '/getCountry'
    .success (data) ->
        $scope.country_phone = data
    .error (err) ->
        console.log err

    # $scope.getPhoneCode = () ->
    #   result = $scope.getCountryNumberphone
    #   return result

    $scope.limitOptions = [5, 10, 15]
    $scope.selected = []
    $scope.config =
      itemsPerPage: 5
      fillLastPage: true
    $scope.required = true

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
    $scope.submitNumPhone = () ->
      console.log "ça passe par la !"
      console.log $scope.numPhoneUser
      console.log $scope.getCountryNumberphone
      phoneSub = {
        code: $scope.getCountryNumberphone
        numero: $scope.numPhoneUser
      }
      if $scope.numPhoneUser && $scope.getCountryNumberphone
        $scope.listNumTel.push phoneSub
        $scope.phoneSub              = {}
        $scope.phone                 = false
        $scope.ajouterNum            = true
        $scope.getCountryNumberphone = null
        $scope.numPhoneUser          = null

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
        scope.getEmail     = ''
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
        $scope.chargeVoySub = {}
        $scope.chargeVoy = false
        $scope.ajouterChargeVoy = true
        $scope.user.nomChargeVoy = null

#Responsable de Voyage préféré
    $scope.ajouterResponsable = true
    $scope.responsable = false
    $scope.showPanelResponsable = () ->
      $scope.responsable = true
      $scope.ajouterResponsable = false
    $scope.hidePanelResponsable = () ->
      $scope.responsable = false
      $scope.ajouterResponsable = true

    $scope.listResponsable = []
    $scope.submitResponsable = ->
      responsableSub = {
        name: $scope.user.responsable
      }
      if $scope.user.responsable
        $scope.listResponsable.push responsableSub
        $scope.responsableSub = {}
        $scope.responsable = false
        $scope.ajouterResponsable = true
        $scope.user.nomResponsable = null

#Passeport
    $scope.ajouterPasseport = true
    $scope.passeport = false
    $scope.showPanelPasseport = () ->
      $scope.passeport = true
      $scope.ajouterPasseport = false
    $scope.hidePanelPasseport = () ->
      $scope.passeport = false
      $scope.ajouterPasseport = true

    $scope.listPasseport = []
    $scope.submitPasseport = ->
      passeportSub = {
        name: $scope.user.passeport
      }
      if $scope.user.passeport
        $scope.listPasseport.push passeportSub
        $scope.passeportSub = {}
        $scope.passeport = false
        $scope.ajouterPasseport = true
        $scope.user.nomPasseport = null

#Carte de fidélité
    $scope.ajouterFidelite = true
    $scope.fidelite = false
    $scope.showPanelFidelite = () ->
      $scope.fidelite = true
      $scope.ajouterFidelite = false
    $scope.hidePanelFidelite = () ->
      $scope.fidelite = false
      $scope.ajouterFidelite = true

    $scope.listFidelite = []
    $scope.submitFidelite = ->
      fideliteSub = {
        name: $scope.user.fidelite
      }
      if $scope.user.fidelite
        $scope.listFidelite.push fideliteSub
        $scope.fideliteSub = {}
        $scope.fidelite = false
        $scope.ajouterFidelite = true
        $scope.user.nomFidelite = null

    $scope.ajouterFideliteTrain = true
    $scope.CarteFideliteTrain = false

    $scope.showPanelCarteFideliteTrain = () ->
      $scope.CarteFideliteTrain = true
      $scope.ajouterFideliteTrain = false
      $scope.TabRecupfideliteTrain = false;
    $scope.hidePanelCarteFideliteTrain = () ->
      $scope.CarteFideliteTrain = false
      $scope.ajouterFideliteTrain = true
      $scope.TabRecupfideliteTrain = true;

    $scope.listFideliteTrain = []
    $scope.submitFideliteTrain = ->
      fideliteTrainSub = {
        name: $scope.user.fideliteTrain
      }
      if $scope.user.fideliteTrain
        $scope.listFidelite.push fideliteSub
        $scope.fideliteSub = {}
        $scope.CarteFideliteTrain = false
        $scope.ajouterFideliteTrain = true
        $scope.user.nomFideliteTrain = null

#Carte de voyage


    $scope.ajouterCarteVoy = true
    $scope.carteVoy = false
    $scope.showPanelCarteVoy = () ->
      $scope.carteVoy = true
      $scope.ajouterCarteVoy = false
      $scope.TabRecupCardVoy = false;
    $scope.hidePanelCarteVoy = () ->
      $scope.carteVoy = false
      $scope.ajouterCarteVoy = true
      $scope.TabRecupCardVoy = true;

    $scope.listCarteVoy = []
    $scope.submitCarteVoy = ->
      carteVoySub = {
        name: $scope.user.carteVoy
      }
      if $scope.user.carteVoy
        $scope.listCarteVoy.push carteVoySub
        $scope.carteVoySub = {}
        $scope.carteVoy = false
        $scope.ajouterCarteVoy = true
        $scope.user.nomCarteVoy = null

#Carte de fidélité Hotel
    $scope.ajouterFideliteHotel = true
    $scope.fideliteHotel = false
    $scope.showPanelFideliteHotel = () ->
      $scope.fideliteHotel = true
      $scope.ajouterFideliteHotel = false
    $scope.hidePanelFideliteHotel = () ->
      $scope.fideliteHotel = false
      $scope.ajouterFideliteHotel = true

    $scope.listFideliteHotel = []
    $scope.submitFideliteHotel = ->
      fideliteHotelSub = {
        name: $scope.user.fidelite
      }
      if $scope.user.fideliteHotel
        $scope.listFideliteHotel.push fideliteHotelSub
        $scope.fideliteHotelSub = {}
        $scope.fideliteHotel = false
        $scope.ajouterFideliteHotel = true
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
        if !searchTerm
            console.log "no text"
        else
            getArray = toArray(object,name)
            result   = find(searchTerm, getArray)
            result2  = toObject(result, name)
            return result2

    $scope.getCodeNumber = (country, value) ->
      # console.log country
      console.log "ça passe toujour par la !"
      $http
          method: 'GET'
          url:    options.api.base_url + '/phoneCode/' + country
      .success (data) ->
          console.log value
          $scope.getCountryNumberphone = data[0].phonecode
      .error (err) ->
          console.log err

    $scope.querySearch = (query,name) ->
        if (name == 'villeGare')
            result = arrayObjectIndexOf($scope.railDepartureStation, query,name)
        else
            result = arrayObjectIndexOf($scope.country_phone, query,name)
        return result
