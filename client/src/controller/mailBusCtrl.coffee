tableau
.controller 'mailBusCtrl', ($scope,$http, $sce,SweetAlert,store, jwtHelper, $q) ->
    if store.get('JWT')
      token                = store.get('JWT')
      decode               = jwtHelper.decodeToken(token)
    console.log decode
    $scope.step            = '1';
    currentDate            = new Date()
    day                    = currentDate.getDate()
    month                  = currentDate.getMonth() + 1
    year                   = currentDate.getFullYear()
    $scope.today           =  year  + "-" + month + "-" +  day
    $scope.cityStart       = "";
    $scope.cityEnd         = "";
    $scope.ObjtAller       = null;
    $scope.ObjtRetour      = null;
    $scope.select_retour   = null
    $scope.select_aller    = null
    $scope.radioTypeAR    = "aller_retour";
    $scope.message         = null
    $scope.last            = ""
    $scope.forwho          = "me"
    $scope.checkUser       = options.api.base_url + "/checkUser/" + decode[0].site_id + decode[0].site_id + "/"
    $scope.loading         = false

    $scope.$watch 'cityStart', ->
        if $scope.cityStart == null
            $scope.getUrl = "null"
        else
            $scope.getUrl = options.api.base_url + "/arrivalBus/" + $scope.cityStart.title + "/"

    $scope.checkFirstName = (last) ->
         if last != undefined
            if last.title
                $scope.comLast = last
                return options.api.base_url + "/checkFirstName/" + decode[0].site_id + decode[0].site_id + "/" + last.title + "/"           

    getRole = () ->
        $scope.justTraveler = false
        $http
            method: "POST"
            url:    options.api.base_url + "/aetmRoles"
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
            url:    options.api.base_url + "/userMailInfo"
            data:    
                uid : decode[0].UID
                site_id: decode[0].site_id + decode[0].site_id
        .success (data) ->
            $scope.InfosReceiver = data
            console.log data
    getInfoMe()

    callTraject = (_data, cb) ->
            $http
                method: "POST"
                url:    "http://151.80.121.114:5555/api/findStations"
                data:    _data
            .success (_busResult) ->
                cb(_busResult)
            .error (err) ->
                cb(false)

    $scope.submit = ->
        $scope.message = null
        if $scope.radioTypeAR == "aller"
            if !$scope.cityStart.title ||  !$scope.cityEnd.title || !$scope.date_depature  
                $scope.message = "L'ensemble des champs est requis pour effectuer votre recherche "
            else    
                $scope.message = null
        else 
            if !$scope.cityStart.title ||  !$scope.cityEnd.title || !$scope.date_depature || !$scope.date_arrival  
                $scope.message = "L'ensemble des champs est requis pour effectuer votre recherche "
            else 
                $scope.message = null
        if $scope.message == null
            $scope.loading = true
            trajetsResult        = null
            trajetsResult_return = null
            postdata = 
                    cityStart : $scope.cityStart.title
                    cityEnd   : $scope.cityEnd.title
                    dateStart : $scope.date_depature
                    site_id              : decode[0].site_id
            if $scope.radioTypeAR == "aller"
                callTraject postdata, (result) ->
                    if (result != false)
                        $scope.trajetsResult = result
                        $scope.loading = false
                        $scope.step = '2'
            else
                callTraject postdata, (result) ->
                    $scope.trajetsResult = result
                    returndata = 
                        cityEnd   : $scope.cityStart.title
                        cityStart : $scope.cityEnd.title
                        dateStart : $scope.date_arrival
                        site_id   : decode[0].site_id
                    callTraject returndata, (returnresult) ->
                        console.log returnresult
                        $scope.trajetsResult_return = returnresult
                        $scope.loading = false
                        $scope.step = '2'

    $scope.parseDate = (data) ->
         data = Date.parse(data)
         return data
    $scope.parseTime = (data) ->
        return new Date(1970, 0, 1).setSeconds(data);

    $scope.return   = () ->
        $scope.ObjtRetour            = null
        $scope.ObjtAller             = null
        $scope.trajetsResult         = null
        $scope.trajetsResult_return  = null
        $scope.step       = '1'

    $scope.confirm  = (option) ->
        
        if $scope.forwho == 'me'
            infoForWho = 
                fullName  : $scope.InfosReceiver.first_name + ' ' + $scope.InfosReceiver.last_name
                email     : $scope.InfosReceiver.email
                uid       : decode[0].UID
            console.log infoForWho
        else if $scope.forwho == 'community'
            infoForWho = 
                fullName  : $scope.comName.title
                email     : $scope.comName.originalObject.EMAIL
                uid       : $scope.comName.originalObject.UID
            console.log infoForWho
        else if $scope.forwho == 'guest'
            infoForWho =
                fullName  : $scope.guest_lastname + ' ' + $scope.guest_firstname
                email     : $scope.guest_email
                uid       : decode[0].UID  
            console.log infoForWho
        swal {
            title: "Confirmer ce voyage ?"
            text:  "Vous êtes sur le point de réserver ce voyage pour ce voyageur : </br></br> Nom : " + infoForWho.fullName + "</br> Email : " + infoForWho.email 
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
                        url:    options.api.base_url + "/mail"
                        data: 
                            infoForWho : infoForWho
                            depart :     $scope.ObjtAller
                            retour :     $scope.ObjtRetour
                    .success (data) ->
                        swal 'Confirmé!', 'Vous allez recevoir prochainement un e-mail pour confirmer votre réservation.', 'success'
                        # $route.reload()
                    .error (err) ->
                        swal 'erreur!', "Votre réservation n'a pas pu aboutir", 'error' 