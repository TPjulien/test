tableau
.controller 'datatableCtrl', ($scope, $http, jwtHelper, store, $window, $filter, $stateParams, $sce) ->
    value                    = 50
    $scope.datatable         = []
    $scope.datatable_filters = []
    $scope.column_filter     = []
    filter_array_text        = []
    schema                   = null
    table                    = null
    bullet_filters           = []

    # fonction qui permet d'avoir les données du bullet
    getBullet = (value) ->
        table = null
        name  = null
        # console.log value
        angular.forEach value, (name, key) ->
            # console.log value[key].has_bullet_filter
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
        $http
            method: 'POST'
            url:    options.api.base_url + '/getDatatable'
            data:
                generic_data: $scope.detail
                filters:      filter_array_text
                min:          min
                max:          max
        .success (data) ->
            $scope.data_table = data
            schema = $scope.data_table.datatable_width[0].schema
            table  = $scope.data_table.datatable_width[0].table
            if bullet_filters.length == 0
                getBullet(data.datatable_width);
        .error (err) ->
            # mettre un toast en cas d'erreur
            console.log err
    getDatatable(0, 50)

    $scope.getGenericRow = (value, width) ->
        result = []
        count  = 0;
        # on supprime le hashkey car inutile pour afficher les données
        delete value.$$hashKey
        for data, name of value
            # console.log name
            if name == null
                name = "donnée indisponible"
            # on vérifie si c'est une date time
            if data.indexOf('DATE') != -1
                name = $filter('date')(name, "yyyy/MM/dd")
                # result += "<p class='col s" + width[count].width + " md-whiteframe-1dp truncate' style='background-color:white'>" + name + "</p>"
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

    $scope.filterDate = (start, end, column_name) ->
        verifyArray(column_name)
        date_array = []
        date_array.push date_start = $filter('date')(start._d, "yyyy-MM-dd")
        date_array.push date_end   = $filter('date')(end._d, "yyyy-MM-dd")

        object_to_filter             = {}
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
                                Par """ + filters[name] +
                          """ : </h5>"""
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
                        # so deep ! PEGI 18 !
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
                    dynamic_entry = "filterDate(start, end, '" + get_filter_column_name + "')"
                    result += '<ob-daterangepicker class="col s12"
                                                   style="font-size:10px;"
                                                   on-apply="' + dynamic_entry + '" &nbsp;
                                                   range="vm.range">
                               </ob-daterangepicker>'
        return $sce.trustAsHtml result
    # $scope.nameValue = (name) ->
    #   return name.CABIN_CONCATENATED_CODE
    #
    # $scope.tototo = (min, max) ->
    #     search_price_min = min
    #     search_price_max = max
    #     $scope.data      = []
    #     counter          = 0
    #     $scope.testFacture(0, 50)
    #
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
    # $scope.slider =
    #     min: 0
    #     max: 5000
    #     options:
    #         floor:    0
    #         ceil:     5000
    #         interval: 1000
    #         step:     value
    #         translate: (value) ->
    #             value + '€'
    #         onChange: () ->
    #           $scope.getValues($scope.slider.min, $scope.slider.max)
    #         onEnd: () ->
    #           $scope.tototo($scope.slider.min, $scope.slider.max)
    #
    # $scope.convert = (number) ->
    #     numberValue = number
    #     numberValue.toFixed(2)
    #
    # $scope.getColor = (color) ->
    #   css = 'background-color:' + color
    #   return css
    #
    #
    # getFilter = () ->
    #     $http
    #         method: "GET"
    #         url:    options.api.base_url + '/rules/' + decode[0].site_id + '/' + decode[0].user_id
    #     .success (data) ->
    #         $scope.allow_filters.rules_filter_canFilterDate         = Boolean(+data[0].rules_filter_canFilterDate)
    #         $scope.allow_filters.rules_filter_canFilterNameClient   = Boolean(+data[0].rules_filter_canFilterNameClient)
    #         $scope.allow_filters.rules_filter_canFilterNumberClient = Boolean(+data[0].rules_filter_canFilterNumberClient)
    #         $scope.allow_filters.rules_filter_canFilterPRice        = Boolean(+data[0].rules_filter_canFilterPRice)
    #         $scope.allow_filters.rules_filter_canFilterType         = Boolean(+data[0].rules_filter_canFilterType)
    #     .error (err) ->
    #         console.log err
    #
    # getFilter()
    #
    # $scope.testFacture = (min, max) ->
    #     $http
    #       method: "GET"
    #       url: options.api.base_url + '/pdfSearchFilter/' + search_type + '/' + search_num_invoice + '/' + search_price_min + '/' + search_price_max + '/' + min + '/' + max + '/' + search_name + '/' + search_date_min + '/' + search_date_max + '/' + search_num_commande
    #     .success (result) ->
    #       number  = 0
    #       while number < result.length
    #         $scope.data.push ({num: result[number]})
    #         number++
    #       counter = result.length
    #     .error (err) ->
    #       console.log err
    #
    # $scope.loadMore = ->
    #     if $scope.information
    #     else if (counter == 0)
    #         $scope.testFacture($scope.data.length, $scope.data.length + 50)
    #         counter += 50
    #     else
    #         $scope.testFacture(counter, counter + 20)
    #         counter += 20
    #
    # $scope.getTypeFilter = (type) ->
    #     search_type = type
    #     $scope.data = []
    #     counter     = 0
    #     $scope.testFacture(0, 50)
    #
    # $scope.filterCommande = (num_commande) ->
    #     if num_commande != undefined
    #       if (num_commande.length == 0)
    #         search_num_commande = "none"
    #         $scope.data         = []
    #         counter             = 0
    #         $scope.testFacture(0, 50)
    #       else
    #         search_num_commande = num_commande
    #         $scope.data = []
    #         counter     = 0
    #         $scope.testFacture(0, 50)
    #
    # $scope.filterFacture = (tmpStr) ->
    #     if tmpStr != undefined
    #       if (tmpStr.length == 0)
    #         search_num_invoice = "none"
    #         $scope.data        = []
    #         counter            = 0
    #         $scope.testFacture(0, 50)
    #       else
    #         search_num_invoice = tmpStr
    #         $scope.data        = []
    #         counter            = 0
    #         $scope.testFacture(0, 50)
    #
    # $scope.filterName = (tmpStr) ->
    #     if tmpStr != undefined
    #       if (tmpStr.length == 0)
    #           search_name = "none"
    #           $scope.data = []
    #           counter     = 0
    #           $scope.testFacture(0, 50)
    #       else
    #           search_name = tmpStr
    #           $scope.data = []
    #           counter     = 0
    #           $scope.testFacture(0, 50)
    #
    # $scope.filterDate = (start, end) ->
    #   search_date_min = $filter('date')(start._d, "yyyy-MM-dd")
    #   search_date_max = $filter('date')(end._d,   "yyyy-MM-dd")
    #   $scope.data     = []
    #   counter         = 0
    #   $scope.testFacture(0, 50)
    #   if start._d.length == 0 && end._d.length == 0
    #       $scope.data = []
    #       counter     = 0
    #       search_date_min = "none"
    #       search_date_max = "none"
    #       $scope.testFacture(0, 50)
    #
    # $scope.checkName = (name) ->
    #   if !name
    #       newName = "Information indisponible"
    #   else
    #       newName = name
    #
    # $scope.getColor = (type) ->
    #   color: undefined
    #   if type == "CommercialInvoice"
    #       color = "color: #2196F3"
    #   else
    #       color = "color: #F44336"
    #
    # $scope.menuOptions = [
    #   [
    #     'Voir'
    #     ($itemScope) ->
    #       facture = $itemScope.facture.num.NUM_INVOICE
    #       $scope.watchPdf(facture)
    #   ]
    #   null
    #   [
    #     'Telecharger'
    #     ($itemScope) ->
    #       facture = $itemScope.facture.num.NUM_INVOICE
    #       $scope.downloadPdf(facture)
    #   ]
    # ]
    #
    # $scope.getColorFactureType = (type) ->
    #   color = undefined
    #   if type == null
    #     color = "color: #F44336"
    #
    # $scope.convertSupplier = (suplier) ->
    #     translated = undefined
    #     if suplier == null
    #       translated = "Information indisponible"
    #     else
    #       translated = suplier
    #
    # $scope.convertFacType = (type) ->
    #   typeTranslated = undefined
    #   if type == "CommercialInvoice"
    #       typeTranslated = "Facture"
    #   else if type == "CreditNoteGoodsAndServices"
    #       typeTranslated = "Avoir"
    #   else
    #       typeTranslated = "Donnée indisponible"
    #
    # $scope.testFacture(0, 40)
