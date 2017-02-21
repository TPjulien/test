tableau
.controller 'mailBusCtrl', ($scope,$http, $sce,SweetAlert,store, jwtHelper) ->
    if store.get('JWT')
      token               = store.get('JWT')
      decode              = jwtHelper.decodeToken(token)
      console.log decode
    $scope.cityName = "";
    $scope.getArrivalData = [];
    $scope.aller_retour = "aller";

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
                cb(data)
                # $scope.trajetsResult = data
            .error (err) ->
                cb(false)

    $scope.submit = ->
        postdata = 
                "cityStart":      $scope.cityName.title
                "cityEnd"  :      $scope.getArrivalData.title
                "dateStart"     : $scope.date_depature
        if $scope.aller_retour == "aller"
            callTraject postdata, (result) ->
                if (result != false)
                    $scope.trajetsResult = result
        else
            callTraject postdata, (result) ->
                $scope.trajetsResult = result
                returndata = 
                    "cityEnd":      $scope.cityName.title
                    "cityStart" :   $scope.getArrivalData.title
                    "dateStart"   : $scope.date_arrival
                callTraject returndata, (returnresult) ->
                    console.log returnresult
                    $scope.trajetsResult_return = returnresult


    $scope.parseDate = (data) ->
         data = Date.parse(data)
         return data
    $scope.parseTime = (data) ->
        return new Date(1970, 0, 1).setSeconds(data);

    $scope.select_trajet = (trajet,include) ->
        swal {
            title: 'Confirmation'
            text: 'Voulez-vous confirmer ce trajet ?'
            type: 'warning'
            showCancelButton: true
            confirmButtonColor: '#27d17f'
            confirmButtonText: 'Oui, confirmer le trajet!'
            cancelButtonText: 'Non'
            closeOnConfirm: false
            closeOnCancel: false
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