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
    $scope.last            = ""
    $scope.getArrivalData  = "";
    $scope.ObjtAller       = null;
    $scope.ObjtRetour      = null;
    $scope.aller_retour    = "aller_retour";
    $scope.message         = null
    $scope.select_retour   = null
    $scope.select_aller    = null
    $scope.forwho          = "me"
    $scope.checkLastName   = "https://api.tp-control.travelplanet.fr/checkLastName/" + decode[0].site_id + decode[0].site_id + "/"
    $scope.loading         = false

    $scope.$watch 'cityName', ->
        if $scope.cityName == null
            $scope.getUrl = "null"
        else
            $scope.getUrl = "https://api.tp-control.travelplanet.fr/arrivalBus/" + $scope.cityName.title + "/"

    $scope.checkFirstName = (last) ->
         if last != undefined 
            $scope.comLast = last
            return "https://api.tp-control.travelplanet.fr/checkFirstName/" + decode[0].site_id + decode[0].site_id + "/" + last.title + "/"           

    getRole = () ->
        $scope.justTraveler = false
        $http
            method: "POST"
            url:    "https://api.tp-control.travelplanet.fr/aetmRoles"
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
            url:    "https://api.tp-control.travelplanet.fr/userMailInfo"
            data:    
                uid : decode[0].UID
                site_id: decode[0].site_id + decode[0].site_id
        .success (data) ->
            $scope.InfosReceiver = data
    getInfoMe()

    callTraject = (_data, cb) ->
            $http
                method: "POST"
                url:    "https://api.tp-control.travelplanet.fr/findIdStations"
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
                        site_id              : decode[0].site_id
                    getRequest.push($http.post 'https://api.tp-control.travelplanet.fr/livePrice', bodyRequest);
                $q.all(
                    getRequest
                ).then (data) ->
                    for d in _busResult.data
                        for liveData in data
                            if (d.relationships.departure.data.id == liveData.data.departure_station_id && d.relationships.arrival.data.id == liveData.data.arrival_station_id && d.relationships.provider.data.id == liveData.data.provider_id && d.attributes.arrival_time == liveData.data.arrival_time && d.attributes.departure_time == liveData.data.departure_time)
                                d.attributes.price_per_seat = liveData.data.price
                                console.log liveData.data.price
                cb(_busResult)
            .error (err) ->
                cb(false)

    $scope.submit = ->
        $scope.loading = true
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
                    site_id              : decode[0].site_id
            if $scope.aller_retour == "aller"
                callTraject postdata, (result) ->
                    if (result != false)
                        $scope.trajetsResult = result
                        $scope.loading = false
                        $scope.step = '2'
            else
                callTraject postdata, (result) ->
                    $scope.trajetsResult = result
                    returndata = 
                        cityEnd   : $scope.cityName.title
                        cityStart : $scope.getArrivalData.title
                        dateStart : $scope.date_arrival
                        site_id   : decode[0].site_id
                    callTraject returndata, (returnresult) ->
                        $scope.trajetsResult_return = returnresult
                        $scope.loading = false
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
        console.log "objtAller", $scope.ObjtAller 
    
    $scope.SelectRadio = (rowIndex) ->
        $scope.clicked = rowIndex

    $scope.select_trajet_retour  = (trajet,included) ->
        $scope.ObjtRetour =
            attributes: trajet
            includes: included
            uid : decode[0].UID
            site_id: decode[0].site_id
        console.log "ObjetRetour", $scope.ObjtRetour 

    $scope.return   = () ->
        $scope.ObjtRetour = null
        $scope.ObjtAller  = null
        $scope.step       = '1'


    $scope.select_forwho = (forwho) ->
        $scope.forwho = forwho

    $scope.confirm  = (option) ->
        if $scope.forwho == 'me'
            infoForWho = 
                receiveLastName  : $scope.InfosReceiver.last_name
                receiveFirstName : $scope.InfosReceiver.first_name
                receiveEmail     : $scope.InfosReceiver.email
        else if $scope.forwho == 'community'
            infoForWho = 
                receiveLastName  : $scope.comLast.title
                receiveFirstName : option.title
                receiveEmail     : option.originalObject.EMAIL
        else if $scope.forwho == 'guest'
            infoForWho =
                receiveLastName  : $scope.guest_lastname 
                receiveFirstName : $scope.guest_firstname
                receiveEmail     : $scope.guest_email
        swal {
            title: "Confirmer ce voyage ?"
            text:  "Vous êtes sur le point de réserver ce voyage pour ce voyageur : </br></br> Nom : " + infoForWho.receiveLastName + "</br> Prénom : " + infoForWho.receiveFirstName + "</br> Email : " + infoForWho.receiveEmail 
            type:  "warning"
            showCancelButton: true
            confirmButtonColor: '#27d17f'
            confirmButtonText: 'Oui, confirmer le trajet!'
            cancelButtonText: 'Non'
            closeOnConfirm: false
            closeOnCancel: true
            html : true
            }, (isConfirm) ->
                if isConfirm
                    $http
                        method: "POST"
                        url:    "https://api.tp-control.travelplanet.fr/mail"
                        data: 
                            infoForWho : infoForWho
                            depart :     $scope.ObjtAller
                            retour :     $scope.ObjtRetour
                    .success (data) ->
                        swal 'Confirmé!', 'Vous allez recevoir prochainement un e-mail pour confirmer votre réservation.', 'success'
                        # $route.reload()
                    .error (err) ->
                        swal 'erreur!', "Votre réservation n'a pas pu aboutir", 'error' 