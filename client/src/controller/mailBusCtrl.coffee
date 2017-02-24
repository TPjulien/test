tableau
.controller 'mailBusCtrl', ($scope,$http, $sce,SweetAlert,store, jwtHelper, $q) ->
    if store.get('JWT')
      token               = store.get('JWT')
      decode              = jwtHelper.decodeToken(token)
    $scope.step = '1';
    currentDate        = new Date()
    day                = currentDate.getDate()
    month              = currentDate.getMonth() + 1
    year               = currentDate.getFullYear()
    $scope.today       =  year  + "-" + month + "-" +  day
    $scope.cityName = "";
    $scope.getArrivalData = "";
    $scope.ObjtAller = null;
    $scope.aller_retour = "aller_retour";
    $scope.message = null
    $scope.select_retour = null
    $scope.select_aller = null
    
    $scope.$watch 'cityName', ->
        if $scope.cityName == null
            $scope.getUrl = "null"
        else
            $scope.getUrl = "http://151.80.121.114:5555/api/arrivalBus/"+ $scope.cityName.title + "/"

    livePrice = (data, cb) ->
        if data.attributes.ask_for_live_connection_data == true
            $http
                method: "POST"
                url:    "http://151.80.121.114:5555/api/livePrice"
                data:    
                    departure: data.relationships.departure.data.id
                    arrival:   data.relationships.arrival.data.id
                    departure_time : data.attributes.departure_time
                    arrival_time : data.attributes.arrival_time
                    provider : data.relationships.provider.data.id
            .success (dataPrice) ->
                cb(dataPrice.data.attributes.price_per_seat)
            .error (err) ->
                console.log false

    queryPriceBuilder = (_array, _original, cb) ->
        getRequest = []
        
        for array in _array
            bodyRequest =
                departure_station_id : array.relationships.departure.data.id 
                arrival_station_id :  array.relationships.arrival.data.id
                departure_time : array.attributes.departure_time
                arrival_time : array.attributes.arrival_time
                provider_id : array.relationships.provider.data.id

            tempRequest = $http.post 'http://151.80.121.114:5555/api/livePrice', bodyRequest;
            getRequest.push(tempRequest);
        $q.all(
            getRequest
        ).then (data) ->
            for d in _original.data
                for liveData in data
                    if (d.relationships.departure.data.id == liveData.data.departure_station_id and d.relationships.arrival.data.id == liveData.data.arrival_station_id and d.relationships.provider.data.id == liveData.data.provider_id)
                        d.attributes.price_per_seat = liveData.data.price
            cb(_original)
        .catch (err) ->
            console.log(err);

# méthod pour récupérer l'ensemble des trajets disponible en fonction des villes et date postés

    callTraject = (_data, cb) ->
            $http
                method: "POST"
                url:    "http://151.80.121.114:5555/api/findIdStations"
                data:    _data
            .success (data) ->
                tempArray = [];
                for d in data.data
                    if d.attributes.ask_for_live_connection_data == true
                        tempObject = d
                        tempArray.push tempObject
                queryPriceBuilder tempArray, data, (_result) ->
                        cb(_result)
            .error (err) ->
                cb(false)

    $scope.submit = ->
        $scope.message = null
        if $scope.aller_retour == "aller"
            if !$scope.cityName.title ||  !$scope.getArrivalData.title || !$scope.date_depature  
                $scope.message = " L'ensemble des champs est requis pour effectuer votre recherche "
            else    
                $scope.message = null
        else 
            if !$scope.cityName.title ||  !$scope.getArrivalData.title || !$scope.date_depature || !$scope.date_arrival  
                $scope.message = " L'ensemble des champs est requis pour effectuer votre recherche "
            else 
                $scope.message = null
        if $scope.message == null
            trajetsResult        = null
            trajetsResult_return = null
            postdata = 
                    cityStart:      $scope.cityName.title
                    cityEnd  :      $scope.getArrivalData.title
                    dateStart     : $scope.date_depature
            if $scope.aller_retour == "aller"
                callTraject postdata, (result) ->
                    if (result != false)
                        $scope.trajetsResult = result
                        $scope.step = '2'
            else
                callTraject postdata, (result) ->
                    $scope.trajetsResult = result
                    returndata = 
                        cityEnd:      $scope.cityName.title
                        cityStart :   $scope.getArrivalData.title
                        dateStart   : $scope.date_arrival
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
                        attributes: trajet
                        includes: include
                        uid : decode[0].UID
                        site_id: decode[0].site_id
                .success (data) ->
                    swal 'Confirmé!', 'Vous allez recevoir prochainement un e-mail pour confirmer votre réservation.', 'success'
                .error (err) ->
                    swal 'erreur!', "Votre réservation n'a pas pu aboutir", 'error' 