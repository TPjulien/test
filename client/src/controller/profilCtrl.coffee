tableau
.controller "profilCtrl",($scope,$mdDialog,$http,$q,NgTableParams,$log) ->
#Ajouter user
    $scope.ajouterUser = false
    $scope.showPanelUser = () ->
      $scope.ajouterUser = true
    $scope.hidePanelUser = () ->
      $scope.ajouterUser = false

    $http
        method: 'GET'
        url: options.api.base_url + '/profils/blyweereri'
    .success (data) ->
        $scope.profils = data[0]
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
          console.log data
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

    $scope.getCodeNumber = (country) ->
      $http
          method: 'GET'
          url:    options.api.base_url + '/phoneCode/' + country
      .success (data) ->
          $scope.user.phoneCode = '+' + data[0].phonecode
      .error (err) ->
          console.log err
    country_phone = $scope.country_phone
    createFilterFor = (query) ->
      lowercaseQuery = angular.lowercase(query)
      console.log lowercaseQuery
      filterFn = (country_phone) ->
          (country_phone.value.indexOf(lowercaseQuery) == 0)


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
    $scope.submitNumPhone = ->
      phoneSub = {
        code: $scope.user.phoneCode
        numero: $scope.user.numPhone
      }
      if $scope.user.numPhone && $scope.user.phoneCode
        $scope.listNumTel.push phoneSub
        $scope.phoneSub = {}
        $scope.phone = false
        $scope.ajouterNum = true
        $scope.user.phoneCode = null
        $scope.user.numPhone = null

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
    $scope.submitMail = ->
      mailSub = {
        mail: $scope.user.mail
      }
      if $scope.user.mail
        $scope.listMail.push mailSub
        $scope.mailSub = {}
        $scope.mail = false
        $scope.ajouterMail = true
        $scope.user.mail = null

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

#Carte de voyage
    $scope.ajouterCarteVoy = true
    $scope.carteVoy = false
    $scope.showPanelCarteVoy = () ->
      $scope.carteVoy = true
      $scope.ajouterCarteVoy = false
    $scope.hidePanelCarteVoy = () ->
      $scope.carteVoy = false
      $scope.ajouterCarteVoy = true

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

    toArray = (object) ->
        data = []
        i = 0
        while i < object.length
            data.push(object[i].nicename)
            i++
        return data

    toObject = (arr) ->
        rv = []
        i = 0
        while i < arr.length
          # rv[i].nicename = null
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

    arrayObjectIndexOf = (object, searchTerm) ->
        searchTerm = searchTerm.substring(0,1).toUpperCase()+searchTerm.substring(1);
        if !searchTerm
            console.log "no text"
        else
            getArray = toArray(object)
            result   = find(searchTerm, getArray)
            result2  = toObject(result)
            return result2

    $scope.querySearch = (query) ->
        result = arrayObjectIndexOf($scope.country_phone, query)
        return result
