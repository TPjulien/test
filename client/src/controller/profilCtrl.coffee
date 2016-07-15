tableau
.controller "profilCtrl",($scope,$mdDialog,$http, $q) ->
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
        console.log 'sisisisisisis'
        $scope.community = data
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



      $http
          method: 'GET'
          url:    options.api.base_url + '/getCountry'
      .success (data) ->
          $scope.country_phone = data
      .error (err) ->
          console.log err
