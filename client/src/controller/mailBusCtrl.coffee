tableau
.controller 'mailBusCtrl', ($scope,$http, $sce,SweetAlert,store, jwtHelper, $q) ->
    if store.get('JWT')
      token                = store.get('JWT')
      decode               = jwtHelper.decodeToken(token)
    $scope.step            = '1';
    currentDate            = new Date()
    day                    = currentDate.getDate()
    month                  = currentDate.getMonth() + 1
    year                   = currentDate.getFullYear()
    $scope.today           =  year  + "-" + month + "-" +  day
    $scope.cityName        = "";
    $scope.comLastName = ""
    $scope.getArrivalData  = "";
    $scope.ObjtAller       = null;
    $scope.aller_retour    = "aller_retour";
    $scope.message         = null
    $scope.select_retour   = null
    $scope.select_aller    = null
    $scope.forwho          = "me"
    $scope.me_email        = "mahefa.kerraro@gmail.com"
    $scope.checkLastName   = "http://151.80.121.114:5555/api/checkLastName/" + decode[0].site_id + decode[0].site_id + "/"

    $scope.$watch 'cityName', ->
        if $scope.cityName == null
            $scope.getUrl = "null"
        else
            $scope.getUrl = "http://151.80.121.114:5555/api/arrivalBus/" + $scope.cityName.title + "/"

    $scope.$watch 'comLastName', ->
        console.log $scope.comLastName
        if $scope.comLastName == null
            $scope.checkFirstName = "null"
        else
            $scope.checkFirstName = "http://151.80.121.114:5555/api/checkFirstName/" + decode[0].site_id + decode[0].site_id + "/" + $scope.comLastName + "/"

    getRole = () ->
        $scope.justTraveler = false
        $http
            method: "POST"
            url:    "http://151.80.121.114:5555/api/aetmRoles"
            data:    
                uid : decode[0].UID
                site_id: decode[0].site_id + decode[0].site_id
        .success (dataRoles) ->
                for data in dataRoles
                    if (dataRoles.length == 1) && (data.ROLE == 'Traveler')
                        $scope.justTraveler = true
    getRole()
    
    getInfoMe = () ->
        $http
            method: "POST"
            url:    "http://151.80.121.114:5555/api/userMailInfo"
            data:    
                uid : decode[0].UID
                site_id: decode[0].site_id + decode[0].site_id
        .success (data) ->
            $scope.InfosReceiver = data
    getInfoMe()

    # getInfoCommunity = () ->
    #     $http
    #         method: "GET"
    #         url:    "http://151.80.121.114:5555/api/checkProfil/site_id/first_name/last_name"
    #         data:    
    #             uid : decode[0].UID
    #             site_id: decode[0].site_id + decode[0].site_id
    #     .success (data) ->
    #         $scope.InfosReceiver = data
    # getInfoCommunity()

    callTraject = (_data, cb) ->
            $http
                method: "POST"
                url:    "http://151.80.121.114:5555/api/findIdStations"
                data:    _data
            .success (_busResult) ->
                tempArray = [];
                for d in _busResult.data
                    if d.attributes.ask_for_live_connection_data == true
                        tempObject = d
                        tempArray.push tempObject

                getRequest = []
                for array in tempArray
                    bodyRequest =
                        departure_station_id : array.relationships.departure.data.id 
                        arrival_station_id   : array.relationships.arrival.data.id
                        departure_time       : array.attributes.departure_time
                        arrival_time         : array.attributes.arrival_time
                        provider_id          : array.relationships.provider.data.id

                    getRequest.push($http.post 'http://151.80.121.114:5555/api/livePrice', bodyRequest);
                $q.all(
                    getRequest
                ).then (data) ->
                    for d in _busResult.data
                        for liveData in data
                            if (d.relationships.departure.data.id == liveData.data.departure_station_id && d.relationships.arrival.data.id == liveData.data.arrival_station_id && d.relationships.provider.data.id == liveData.data.provider_id && d.attributes.arrival_time == liveData.data.arrival_time && d.attributes.departure_time == liveData.data.departure_time)
                                d.attributes.price_per_seat = liveData.data.price
                cb(_busResult)
            .error (err) ->
                cb(false)

    $scope.submit = ->
        $scope.message = null
        if $scope.aller_retour == "aller"
            if !$scope.cityName.title ||  !$scope.getArrivalData.title || !$scope.date_depature  
                $scope.message = "L'ensemble des champs est requis pour effectuer votre recherche "
            else    
                $scope.message = null
        else 
            if !$scope.cityName.title ||  !$scope.getArrivalData.title || !$scope.date_depature || !$scope.date_arrival  
                $scope.message = "L'ensemble des champs est requis pour effectuer votre recherche "
            else 
                $scope.message = null
        if $scope.message == null
            trajetsResult        = null
            trajetsResult_return = null
            postdata = 
                    cityStart : $scope.cityName.title
                    cityEnd   : $scope.getArrivalData.title
                    dateStart : $scope.date_depature
            if $scope.aller_retour == "aller"
                callTraject postdata, (result) ->
                    if (result != false)
                        $scope.trajetsResult = result
                        $scope.step = '2'
            else
                callTraject postdata, (result) ->
                    $scope.trajetsResult = result
                    returndata = 
                        cityEnd   : $scope.cityName.title
                        cityStart : $scope.getArrivalData.title
                        dateStart : $scope.date_arrival
                    callTraject returndata, (returnresult) ->
                        $scope.trajetsResult_return = returnresult
                        $scope.step = '2'


    $scope.parseDate = (data) ->
         data = Date.parse(data)
         return data
    $scope.parseTime = (data) ->
        return new Date(1970, 0, 1).setSeconds(data);

    $scope.select_trajet_aller = (trajet,included) ->  
        $scope.ObjtAller =
            attributes: trajet
            includes: included
            uid : decode[0].UID
            site_id: decode[0].site_id
    
    $scope.SelectRadio = (rowIndex) ->
        $scope.clicked = rowIndex

    $scope.select_trajet_retour  = (trajet,included) ->
        $scope.ObjtRetour =
            attributes: trajet
            includes: included
            uid : decode[0].UID
            site_id: decode[0].site_id

    $scope.return   = () ->
        $scope.step = '1'
        $scope.ObjtRetour = null
        $scope.ObjtAller  = null
    
    $scope.confirm  = (trajet,include) ->
        swal {
            title: 'Confirmation'
            text: 'Êtes vous sur de bien vouloir réserver ce voyage ?'
            type: 'warning'
            showCancelButton: true
            confirmButtonColor: '#27d17f'
            confirmButtonText: 'Oui, confirmer le trajet!'
            cancelButtonText: 'Non'
            closeOnConfirm: false
            closeOnCancel: true
            }, (isConfirm) ->
            if isConfirm
                $http
                    method: "POST"
                    url:    "http://151.80.121.114:5555/api/mail"
                    data: 
                        depart :    $scope.ObjtAller
                        retour :    $scope.ObjtRetour
                .success (data) ->
                    swal 'Confirmé!', 'Vous allez recevoir prochainement un e-mail pour confirmer votre réservation.', 'success'
                    $scope.cityName = null
                    $scope.getArrivalData = null
                    $scope.date_arrival = null
                    $scope.date_departure = null
                    $scope.step = '1'
                .error (err) ->
                    swal 'erreur!', "Votre réservation n'a pas pu aboutir", 'error' 