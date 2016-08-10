tableau
.controller 'datatableCtrl', ($scope, $http, jwtHelper, store, $window, $filter, $stateParams, $sce) ->

    console.log picker
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

    # fonction qui permet d'avoir les données du bullet
    getBullet = (value) ->
        table = null
        name  = null
        # console.log value
        angular.forEach value, (name, key) ->
            if value[key].has_bullet_filter != null
                table = value[key]
                $http
                    method: 'POST'
                    url:    options.api.base_url + '/getBulletFilter'
                    data:
                        column_name: table.column
                        table:       table.table
                        schema:      table.schema
                .success (data) ->
                    bullet_filters.push data

    # on recupere les données de chaque instance de $scope.detail
    getDatatable = (min, max) ->
        array_concat = []
        $http
            method: 'POST'
            url:    options.api.base_url + '/getDatatable'
            data:
                generic_data: $scope.detail
                filters:      filter_array_text
                min:          min
                max:          max
        .success (data) ->
            if counter != 50 and data.datatable.length == 0
                console.log "datatable empty"
            else
                if $scope.datatable_columns.length == 0
                    $scope.datatable_columns = data.datatable
                else
                    $scope.datatable_columns = $scope.datatable_columns.concat data.datatable

                $scope.data_table = data
                schema = $scope.data_table.datatable_width[0].schema
                table  = $scope.data_table.datatable_width[0].table
                if bullet_filters.length == 0
                    getBullet(data.datatable_width);
        .error (err) ->
            # mettre un toast en cas d'erreur
            console.log err
    getDatatable(0, 50)

    # infinite scroll
    $scope.loadMore = () ->
        if (counter == 0)
            getDatatable($scope.data_table.datatable.length, $scope.data_table.datatable.length + 50)
            counter += 50
        else
            getDatatable(counter, 20)
            counter += 20

    $scope.getGenericRow = (value, width) ->
        result = []
        count  = 0;
        # on supprime le hashkey car inutile pour afficher les données
        delete value.$$hashKey
        for data, name of value
            if name == null
                name = "donnée indisponible"
            # on vérifie si c'est une date time
            if data.indexOf('DATE') != -1
                name = $filter('date')(name, "yyyy/MM/dd")
            result += "<p class='col s" + width[count].width + " md-whiteframe-1dp truncate' style='background-color:white'>" + name + "</p>"
            count++
        return result

    # http qui permet de recuperer les filtres
    $http
        method: 'GET'
        url:    options.api.base_url + '/getFilterDatatable/' + $scope.detail.SITE_ID + '/' + $scope.detail.VIEW_ID + '/' + $scope.detail.EMBED_ID
    .success (data) ->
        $scope.datatable_filters = data.datatable_filters
        $scope.column_filter     = data.column_filter
    .error (err) ->
        # faire un toast
        console.log err

    $scope.getLabel = (value) ->
        return "Label test"

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

    forbiddenWord = (value) ->
        forbidden_word = ['', 'all']
        if value in forbidden_word
            return false
        else
            return true
    # Generique champs de text
    $scope.filterText = (value, column_name) ->
        $scope.datatable_columns = []
        counter = 50;
        # appell de la fonction qui permet de nettoyer l'objet
        verifyArray(column_name)
        # on vérifie si la value n'est pas vide, si oui on l'injecte dans le tableau, sinon on ne l'ajoute pas
        if forbiddenWord(value) == true
            # on injecte dans un tableau qui lui va faire la correspondance client-serveur
            object_to_filter             = {}
            object_to_filter.column_name = column_name
            object_to_filter.value       = value
            filter_array_text.push object_to_filter
        # la function pour lancer la requete
        getDatatable(0, 50);

    $scope.filterDate = (range_date, column_name) ->
        $scope.datatable_columns = []
        date_array               = []
        object_to_filter         = {}
        counter = 50
        verifyArray(column_name)
        date_array.push range_date.startDate
        date_array.push range_date.endDate
        object_to_filter.column_name = column_name
        object_to_filter.value       = date_array
        filter_array_text.push object_to_filter
        getDatatable(0, 50);

    $scope.getGenericFilter = (filters, key) ->
        # console.log name, value
        result                 = null
        get_filter_column_name = null
        delete filters.$$hashKey
        for name, values of filters
            if filters[name] != null
                # permet de retrouver le nom de la colonne associé au filtre
                for column_name, value_column of $scope.column_filter[key]
                    get_filter_column_name = value_column
                result = """<h5 class = "md-subhead"
                                style = "text-align: left">
                                Par """ + filters[name] + """ :
                             </h5>"""
                # faut trouver une moyen plus cool de faire cela dynamique
                if name == 'has_search_filter'
                    dynamic_entry = "filterText(clientFacture,'" + get_filter_column_name + "')"
                    result       += "<input for         = '" + name + "'
                                       ng-change        = " + dynamic_entry + " &nbsp;
                                       ng-model         = 'clientFacture'
                                       name             = 'clientFacture'
                                       ng-model-options = '{debounce: 1000}'
                                       minlength        = '1'
                                       maxlength        = '10'>
                                    </input>"
                else if name == 'has_bullet_filter'
                    if bullet_filters.length != 0
                        generic_bullet = []
                        dynamic_entry = "filterText(value,  '" + get_filter_column_name + "')"
                        result       += '<md-radio-group ng-change = "' + dynamic_entry + '" &nbsp;
                                                         ng-model  = "value">'
                        generic_bullet += '<md-radio-button value = "all"
                                              class = "md-primary">
                                              Tous
                                          </md-radio-button>'
                        angular.forEach bullet_filters, (name, key) ->
                            angular.forEach name, (value, deep_key) ->
                                angular.forEach value, (deep_value, deep_key_level_2) ->
                                        if deep_value != null
                                            generic_bullet += '<md-radio-button value = "' + deep_value + '">
                                                                ' + deep_value + '
                                                               </md-radio-button>'
                        result += generic_bullet + '</md-radio-group>'
                else if name == 'has_date_filter'
                    dynamic_entry = "filterDate(range, '" + get_filter_column_name + "')"
                    result += '<sm-range-picker-input class           = "col s12"
                                                      style           = "font-size:10px;"
                                                      on-range-select = "' + dynamic_entry + '"
                                                      value           = "date"
                                                      is-required     = "false"
                                                      format          = "YYYY-MM-DD"
                                                      mode            = "date"
                                                      week-start-day  = "monday"
                                                      divider         = "Au">
                               </sm-range-picker-input>'
        # On retourne le code en donnant l'autorisation à angular de poster du html grace à $sce
        return $sce.trustAsHtml result
    # $scope.downloadPdf = (selected) ->
    #     $http
    #         method      : "GET"
    #         url         : options.api.base_url + '/downloadPDF/' + selected
    #         responseType: 'arraybuffer'
    #     .success (result) ->
    #         myblob  = new Blob([result], { type: 'application/pdf' })
    #         blobURL = ( window.URL || window.webkitURL).createObjectURL(myblob)
    #         anchor  = document.createElement("a")
    #         anchor.download = selected + '.pdf'
    #         anchor.href = blobURL
    #         anchor.click()
    #
    # $scope.watchPdf = (selected) ->
    #     $http
    #         method      : "GET"
    #         url         : options.api.base_url + '/downloadPDF/' + selected
    #         responseType: 'arraybuffer'
    #     .success (result) ->
    #         file           = new Blob([result], { type: 'application/pdf'})
    #         fileUrl        = URL.createObjectURL(file)
    #         $window.open(fileUrl,'C-Sharpcorner', 'width=600,height=800')
    #
    # $scope.getValues = (min, max) ->
    #     if min < 1000 || max < 1000
    #         $scope.slider.options.step = 50
    #     else if min > 1000 && min < 3000 || max > 1000 && max < 3000
    #         $scope.slider.options.step = 200
    #     else
    #         $scope.slider.options.step = 500
    #
