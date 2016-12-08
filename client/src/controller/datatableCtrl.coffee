tableau
.controller 'datatableCtrl', ($scope, $http, jwtHelper, store, $window, $filter, $stateParams, $sce, toastErrorFct) ->

    value                    = 50
    $scope.datatable         = []
    $scope.datatable_filters = []
    $scope.column_filter     = []
    filter_array_text        = []
    schema                   = null
    table                    = null
    bullet_filters           = []
    counter                  = 50
    $scope.datatable_columns = []
    $scope.getInfo = []

    $scope.columnNames   = []
    $scope.formattedJson = {}
    $scope.datatableData = []
    $scope.filters       = []
    $scope.nameColumn   = []

    getColumnName = (info) ->
        i = 0
        while i < info.length
            if info[i].column != "BLOB"
                $scope.columnNames.push { column : info[i].column, width: info[i].width }
            i++

    dataFormatted = (info) ->
        temp = []
        i    = 0
        while i < info.length
            if info[i].schema and info[i].table
                $scope.formattedJson.table_name = info[i].schema + "." + info[i].table
            temp.push { column_name : info[i].column }
            i++
        $scope.formattedJson.list_columns = temp
        getDatatable(0, 50)

    getfilters = (info) ->
        temp = {}
        angular.forEach info, (value, key) ->
          angular.forEach value, (value_deep, key_deep) ->
              if key_deep.indexOf('filter') != -1
                  if value_deep.length != 0
                      temp[key_deep + "_" + key] = value_deep
        $scope.filters.push temp

    $scope.init = (info) ->
        $scope.getInfo = info
        getfilters($scope.getInfo.list_datatable)
        getColumnName($scope.getInfo.list_datatable)
        dataFormatted($scope.getInfo.list_datatable)

    $scope.getGenericNameRow = () ->
        if ($scope.columnNames)
            result = ""
            i = 0
            while i < $scope.columnNames.length
                if ($scope.columnNames[i].column != "BLOB")
                    result += "<p class='col s" + $scope.columnNames[i].width + " md-whiteframe-1dp truncate getSize' style='background-color:#64B5F6; color:white; text-align: center'>" + $scope.columnNames[i].column + "</p>"
                i++
            return result

    # ajouter min, max pour tester
    getDatatable = (min, max) ->
        if angular.equals($scope.formattedJson, {}) != true
            $http.post(options.api.base_url + '/getDatatable', { datas: $scope.formattedJson, min : min, max : max, filters: filter_array_text })
            .then (data) ->
                console.log data
                if (counter == 0)
                    $scope.datatableData = data.data
                else
                    if (data.data.constructor == Array)
                        $scope.datatableData = $scope.datatableData.concat data.data

    $scope.getGenericRow = (data) ->
        # console.log data
        result = []
        delete data.$$hashKey
        i = 0
        angular.forEach data, (value, key) ->
            width = null
            # console.log value, key
            for info in $scope.columnNames
                if key == info.column
                    width = info.width
            name    = value
            get_key = key.toLowerCase()
            if get_key.indexOf('date') != -1
                name = $filter('date')(value, "dd/MM/yy")
            else if value == null
                name = "Donnée Indisponible"
            result += "<p class='col s"+ width + " md-whiteframe-1dp truncate getSize' style='background-color:white; text-align:center;'>" + name + "</p>"
        return result

    verifyArray = (column_name) ->
        # on vérifier dans un premier temps si jamais l'objet est utilisé ou non
        if filter_array_text.length >= 0
            count = 0
            # dans un premier temps on parcours le tableau
            for index, value_array of filter_array_text
                # un deuxieme for pour verifier
                for inside_index, inside_value of value_array
                    # evitez les repetitions
                    if inside_value == column_name
                        filter_array_text.splice(count,1)
                count++

    # fonction qui permet d'avoir les données du bullet
    # getBullet = (value) ->
    #     table = null
    #     name  = null
    #     angular.forEach value, (name, key) ->
    #         table = value[key]
    #         if table.has_bullet_filter != ''
    #             if table.has_bullet_filter != null
    #               $http
    #                   method: 'POST'
    #                   url:    options.api.base_url + '/getBulletFilter'
    #                   data:
    #                     column_name: table.column
    #                     table:       table.table
    #                     schema:      table.schema
    #               .success (data) ->
    #                   bullet_filters.push data

    # on recupere les données de chaque instance de $scope.detail
    # getDatatable = (min, max) ->
    #     array_concat = []
    #     $http
    #         method: 'POST'
    #         url:    options.api.base_url + '/getDatatable'
    #         data:
    #             generic_data: $scope.info.list_datatable
    #             filters:      filter_array_text
    #             min:          min
    #             max:          max
    #     .success (data) ->
    #         if counter != 50 and data.datatable.length == 0
    #             toastErrorFct.toastError("Aucune donnée disponible")
    #         else
    #             if $scope.datatable_columns.length == 0
    #                 $scope.datatable_columns = data.datatable
    #             else
    #                 $scope.datatable_columns = $scope.datatable_columns.concat data.datatable
    #
    #             $scope.data_table = data
    #             schema = $scope.data_table.datatable_width[0].schema
    #             table  = $scope.data_table.datatable_width[0].table
    #             if bullet_filters.length == 0
    #                 getBullet(data.datatable_width);
    #     .error (err) ->
    #         toastErrorFct.toastError("Impossible de connecter au serveur de table, veuillez retenter plus tard")

    # getDatatable(0, 50)

    # infinite scroll
    $scope.loadMore = () ->
        if (counter == 0)
            getDatatable($scope.datatableData.length, $scope.datatableData.length + 50)
            counter += 50
        else
            getDatatable(counter, 20)
            counter += 20

    forbiddenWord = (value) ->
        forbidden_word = ['', 'all']
        if value in forbidden_word
            return false
        else
            return true
    # # Generique champs de text
    $scope.filterText = (value, column_name, nameColumn) ->
        $scope.datatable_columns = []
        counter = 0;
        # appell de la fonction qui permet de nettoyer l'objet
        verifyArray(nameColumn)
        # on vérifie si la value n'est pas vide, si oui on l'injecte dans le tableau, sinon on ne l'ajoute pas
        if forbiddenWord(value) == true
            # on injecte dans un tableau qui lui va faire la correspondance client-serveur
            object_to_filter             = {}
            object_to_filter.column_name = nameColumn
            object_to_filter.value       = [value]
            filter_array_text.push object_to_filter
        # la function pour lancer la requete
        getDatatable(0, 50);
    #
    $scope.filterDate = (range_date, column_name, nameColumn) ->
        $scope.datatable_columns = []
        date_array               = []
        object_to_filter         = {}
        counter = 0
        verifyArray(nameColumn)
        date_array.push range_date.startDate
        date_array.push range_date.endDate
        object_to_filter.column_name = nameColumn
        object_to_filter.value       = date_array
        filter_array_text.push object_to_filter
        getDatatable(0, 50);

    $scope.getGenericFilter = () ->
        result                 = ""
        get_filter_column_name = null
        angular.forEach $scope.filters[0], (value, key) ->
            $scope.nameColumn = value
            if key.indexOf('search') != -1
                result += """<h5 class = "md-subhead" style = "text-align: left"> Par """ + value + """ : </h5>"""
                dynamic_entry = "filterText(clientFacture, '" + key + "', '" + value + "')"
                result       += '<input for         = "' + value + '"
                                   ng-change        = "' + dynamic_entry + '"
                                   ng-model         = "clientFacture"
                                   name             = "clientFacture"
                                   ng-model-options = "{debounce: 1000}"
                                   minlength        = "1"
                                   maxlength        = "10">
                                </input>'
            else if key.indexOf('date') != -1
                result += """<h5 class = "md-subhead" style = "text-align: left"> Par """ + value + """ : </h5>"""
                dynamic_entry = "filterDate(range, '" + key + "', '" + value + "')"
                result += '<sm-range-picker-input class           = "col s12"
                                                  style           = "font-size:10px;"
                                                  on-range-select = "' + dynamic_entry + '"
                                                  value           = "' + key + '"
                                                  is-required     = "false"
                                                  format          = "YYYY-MM-DD"
                                                  mode            = "date"
                                                  week-start-day  = "monday"
                                                  divider         = "Au">
                           </sm-range-picker-input>'
                        # permet de retrouver le nom de la colonne associé au filtre
        #                 angular.forEach $scope.column_filter, (valueCol, keyCol) ->
        #                     get_filter_column_name = valueCol.nom_column
        #                     result = """<h5 class = "md-subhead"
        #                                     style = "text-align: left">
        #                                     Par """ + filters.nom_filtre + """ :
        #                                  </h5>"""
        #                 #faut trouver une moyen plus cool de faire cela dynamique
        # angular.forEach $scope.column_filter, (valueCol, keyCol) ->
        #     else if valueCol.nom_column == 'has_bullet_filter'
        #         if bullet_filters.length != 0
        #             generic_bullet = []
        #             dynamic_entry = "filterText(value,  '" + get_filter_column_name + "')"
        #             result       += '<md-radio-group ng-change = "' + dynamic_entry + '" &nbsp;
        #                                              ng-model  = "value">'
        #             generic_bullet += '<md-radio-button value = "all"
        #                                   class = "md-primary">
        #                                   Tous
        #                               </md-radio-button>'
        #             angular.forEach bullet_filters, (name, key) ->
        #                 angular.forEach name, (value, deep_key) ->
        #                     angular.forEach value, (deep_value, deep_key_level_2) ->
        #                             if deep_value != null
        #                                 generic_bullet += '<md-radio-button value = "' + deep_value + '">
        #                                                     ' + deep_value + '
        #                                                    </md-radio-button>'
        #             result += generic_bullet + '</md-radio-group>'
        return $sce.trustAsHtml result

    $scope.downloadPdf = (selected) ->
        if ($scope.getInfo.pdf_display == "true")
            table     = $scope.getInfo.table
            schema    = $scope.getInfo.schema
            resources = []
            temp2 = {}
            angular.forEach selected, (value, key) ->
                temp = value.toString()
                if (/^\d+$/.test(temp) == true) and (temp.length == 9) == true
                    temp2[key] = value
            resources.push(temp2)
            $http.post options.api.base_url + '/downloadBlob', { values : resources, table: table, schema: schema }, responseType: 'arraybuffer'
            .then (data) ->
                a          = document.createElement('a')
                a.style    = "display: none"
                blob       = new Blob [data.data], { type: 'application/json' }
                url        = window.URL.createObjectURL(blob)
                a.href     = url;
                a.download = 'travelplanet.pdf'
                document.body.appendChild(a)
                a.click()
                setTimeout (->
                    document.body.removeChild(a)
                    window.URL.revokeObjectURL(url)
                ), 100
            .catch (err) ->
                console.log err
