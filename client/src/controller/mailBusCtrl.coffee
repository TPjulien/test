tableau
.controller 'mailBusCtrl', ($scope,$http, $sce,SweetAlert,store, jwtHelper) ->
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
    
    $scope.$watch 'cityName', ->
        if $scope.cityName == null
            $scope.getUrl = "null"
        else
            $scope.getUrl = "http://151.80.121.114:5555/api/arrivalBus/"+ $scope.cityName.title + "/"

# méthod pour récupérer l'ensemble des trajets disponible en fonction des villes et date postés
    callTraject = (_data, cb) ->
            $http
                method: "POST"
                url:    "http://151.80.121.114:5555/api/findIdStations"
                data:    _data
            .success (data) ->
                for d in data.data
                    console.log d
                    if d.attributes.ask_for_live_connection_data == true
                        $http
                            method: "POST"
                            url:    "http://151.80.121.114:5555/api/livePrice"
                            data:    
                                departure: d.relationships.departure.data.id
                                arrival:   d.relationships.arrival.data.id
                                departure_time : d.attributes.departure_time
                                arrival_time : d.attributes.arrival_time
                                provider : d.relationships.provider.data.id
                        .success (dataPrice) ->
                            d.attributes.price_per_seat = dataPrice.attributes.price_per_seat
                        .error (err) ->
                            console.log err

                cb(data)
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

    $scope.select_trajet_aller = (trajet,include) ->
        $scope.ObjtAller =
            attributes: trajet
            includes: include
            uid : decode[0].UID
            site_id: decode[0].site_id

    $scope.select_trajet_retour  = (trajet,include) ->
        $scope.ObjtRetour =
            attributes: trajet
            includes: include
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