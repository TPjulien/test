tableau
.controller 'uploadsCtrl', ($scope, $http, Upload) ->

    $scope.uploadNatixis = (file) ->
       url = "http://api-interne-dev.travelplanet.fr/api/Banque/MatchNatixis"
       filename = "Natixis"
       if file.length <= 0 or file == null
           SweetAlert.swal
               title: "Fichier invalide"
               text:  "Format invalide, veuillez uploader un fichier de type xlsx"
               type:  "warning"
       else
           upload(file, url, filename)

   $scope.uploadFiles = (file) ->
       url      = "http://api-interne-dev.travelplanet.fr/api/Banque/MatchSGPalatine"
       filename = "Banque"
       if file.length <= 0 or file == null
           SweetAlert.swal
               title: "Fichier invalide"
               text:  "Format invalide, veuillez uploader un fichier de type xlsx"
               type:  "warning"
       else
           upload(file, url, filename)

   upload = (file, url, filename) ->
       Upload.upload
           method       : 'POST'
           url          : url
           responseType : 'arraybuffer'
           data         : {
             file : file
           }
       .then ((resp, status, headers) ->
           contentType = 'application/zip'
           linkElement = document.createElement('a')

           try
             blob = new Blob([ resp.data ], type: contentType )
             url  = window.URL.createObjectURL blob

             linkElement.setAttribute 'href', url
             linkElement.setAttribute 'download', filename

             clickEvent = new MouseEvent('click',
                 "view": window
                 "bubbles": true
                 "cancelable": false
             )
             linkElement.dispatchEvent clickEvent
           catch ex
             console.log ex
       ), (resp) ->
           console.log 'error status: ' + resp.status

   $scope.downloadNatixisCFONG = () ->
       $http
           method       : 'GET'
           url          : 'http://api-interne-dev.travelplanet.fr/api/Banque/GenerateNatixisCFONB'
           # responseType : 'arraybuffer'
       .success (data) ->
           contentType = 'text/plain'
           linkElement = document.createElement('a')

           filename    = "Travel_planet_la_date"

           try
             blob = new Blob([ data ], type: contentType )
             url  = window.URL.createObjectURL blob

             linkElement.setAttribute 'href', url
             linkElement.setAttribute 'download', filename

             clickEvent = new MouseEvent('click',
                 "view": window
                 "bubbles": true
                 "cancelable": false
             )
             linkElement.dispatchEvent clickEvent
           catch ex
             console.log ex
       .error (err) ->
           console.log err
