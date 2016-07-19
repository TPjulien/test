tableau
.controller "profilCtrl",($scope,$mdDialog,$http,$q,NgTableParams) ->
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
        # console.log data[0].SITE_LIBELLE
    .error (err) ->
        console.log err

    $http
        method: 'GET'
        url:    options.api.base_url + '/community'
    .success (data) ->
        $scope.community = data
        # console.log data[0].SITE_LIBELLE
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
    self = this
    tabData = [{
      name: 'Moroni'
      age: 50
      },{
      name: 'Lucio'
      age: 20
        }]
    self.tableParams = new NgTableParams({}, dataset: tabData)

    $scope.required = true;
    $scope.mois = [
          {
              name: "Janvier"

          },{
              name: "Février"

          },{
              name: "Mars"

          },{
              name: "Avril"

          },{
              name: "Mai"

          },{
              name: "Juin"

          },{
              name: "Juillet"

          },{
              name: "Août"

          },{
              name: "Septembre"

          },{
              name: "Octobre"

          },{
              name: "Novembre"

          },{
              name: "Décembre"
          }
        ]
    $scope.community_valideur = [
          {
              name: "poleemploi"

          },{
              name: "inserm"

          },{
              name: "CNTS"
          }
        ]
    $scope.community_chargeVoy = [
          {
              name: "poleemploi"

          },{
              name: "inserm"

          },{
              name: "CNTS"
          }
        ]
    $scope.jours = [
            {
                name: "1"

            },{
                name: "2"

            },{
                name: "3"

            },{
                name: "4"

            },{
                name: "5"

            },{
                name: "6"

            },{
                name: "7"

            },{
                name: "8"

            },{
                name: "9"

            },{
                name: "10"

            },{
                name: "11"

            },{
                name: "12"

            },{
                name: "13"

            },{
                name: "14"

            },{
                name: "15"

            },{
                name: "16"

            },{
                name: "17"

            },{
                name: "19"

            },{
                name: "20"

            },{
                name: "21"

            },{
                name: "22"

            },{
                name: "23"

            },{
                name: "24"

            },{
                name: "25"

            },{
                name: "26"

            },{
                name: "27"

            },{
                name: "28"

            },{
                name: "29"

            },{
                name: "30"

            },{
                name: "31"
            }
        ]
    $scope.annee = [
          {
            name: 1900
          },
          {
            name: 1901
          },
          {
            name: 1902
          },
          {
            name: 1903
          },
          {
            name: 1904
          },
          {
            name: 1905
          },
          {
            name: 1906
          },
          {
            name: 1907
          },
          {
            name: 1908
          },
          {
            name: 1909
          },
          {
            name: 1910
          },
          {
            name: 1911
          },
          {
            name: 1912
          },
          {
            name: 1913
          },
          {
            name: 1914
          },
          {
            name: 1915
          },
          {
            name: 1916
          },
          {
            name: 1917
          },
          {
            name: 1918
          },
          {
            name: 1919
          },
          {
            name: 1920
          },
          {
            name: 1921
          },
          {
            name: 1922
          },
          {
            name: 1923
          },
          {
            name: 1924
          },
          {
            name: 1925
          },
          {
            name: 1926
          },
          {
            name: 1927
          },
          {
            name: 1928
          },
          {
            name: 1929
          },
          {
            name: 1930
          },
          {
            name: 1931
          },
          {
            name: 1932
          },
          {
            name: 1933
          },
          {
            name: 1934
          },
          {
            name: 1935
          },
          {
            name: 1936
          },
          {
            name: 1937
          },
          {
            name: 1938
          },
          {
            name: 1939
          },
          {
            name: 1940
          },
          {
            name: 1941
          },
          {
            name: 1942
          },
          {
            name: 1943
          },
          {
            name: 1944
          },
          {
            name: 1945
          },
          {
            name: 1946
          },
          {
            name: 1947
          },
          {
            name: 1948
          },
          {
            name: 1949
          },
          {
            name: 1950
          },
          {
            name: 1951
          },
          {
            name: 1952
          },
          {
            name: 1953
          },
          {
            name: 1954
          },
          {
            name: 1955
          },
          {
            name: 1956
          },
          {
            name: 1957
          },
          {
            name: 1958
          },
          {
            name: 1959
          },
          {
            name: 1960
          },
          {
            name: 1961
          },
          {
            name: 1962
          },
          {
            name: 1963
          },
          {
            name: 1964
          },
          {
            name: 1965
          },
          {
            name: 1966
          },
          {
            name: 1967
          },
          {
            name: 1968
          },
          {
            name: 1969
          },
          {
            name: 1970
          },
          {
            name: 1971
          },
          {
            name: 1972
          },
          {
            name: 1973
          },
          {
            name: 1974
          },
          {
            name: 1975
          },
          {
            name: 1976
          },
          {
            name: 1977
          },
          {
            name: 1978
          },
          {
            name: 1979
          },
          {
            name: 1980
          },
          {
            name: 1981
          },
          {
            name: 1982
          },
          {
            name: 1983
          },
          {
            name: 1984
          },
          {
            name: 1985
          },
          {
            name: 1986
          },
          {
            name: 1987
          },
          {
            name: 1988
          },
          {
            name: 1989
          },
          {
            name: 1990
          },
          {
            name: 1991
          },
          {
            name: 1992
          },
          {
            name: 1993
          },
          {
            name: 1994
          },
          {
            name: 1995
          },
          {
            name: 1996
          },
          {
            name: 1997
          },
          {
            name: 1998
          },
          {
            name: 1999
          },
          {
            name: 2000
          },
          {
            name: 2001
          },
          {
            name: 2002
          },
          {
            name: 2003
          },
          {
            name: 2004
          },
          {
            name: 2005
          },
          {
            name: 2006
          },
          {
            name: 2007
          },
          {
            name: 2008
          },
          {
            name: 2009
          },
          {
            name: 2010
          },
          {
            name: 2011
          },
          {
            name: 2012
          },
          {
            name: 2013
          },
          {
            name: 2014
          },
          {
            name: 2015
          },
          {
            name: 2016
          }
        ]

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

#Passport
    $scope.ajouterPassport = true
    $scope.passport = false
    $scope.showPanelPassport = () ->
      $scope.passport = true
      $scope.ajouterPassport = false
    $scope.hidePanelPassport = () ->
      $scope.passport = false
      $scope.ajouterPassport = true

    $scope.listPassport = []
    $scope.submitPassport = ->
      passportSub = {
        name: $scope.user.passport
      }
      if $scope.user.passport
        $scope.listPassport.push passportSub
        $scope.passportSub = {}
        $scope.passport = false
        $scope.ajouterPassport = true
        $scope.user.nomPassport = null

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
