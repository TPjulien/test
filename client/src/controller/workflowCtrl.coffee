tableau
.controller 'workflowCtrl', ($scope,$http, $sce,alertFct) ->
    currentDate        = new Date()
    day                = currentDate.getDate()
    month              = currentDate.getMonth() + 1
    year               = currentDate.getFullYear()
    $scope.go          = false
    $scope.selected    = {}
    $scope.file        = {}
    $scope.multiple_custom = {}
    $scope.today       =  year  + "-" + month + "-" +  day
    console.log $scope.today
    $scope.displayload = false
    $scope.init = (info) ->
        $scope.allowedWorkflows = info.list_workflow

    $scope.getInfosWokflow = () ->
        $http
          method: "POST"
          url:    options.api.base_url + "/infosWokflow"
          data:
            workflow: $scope.WORKFLOW_NAME
        .success (data) ->
            $scope.infosWokflow = data
        .error (err) ->
          console.log err

    $scope.getParameters = () ->
        $scope.queries    =  null
        $scope.parameters = []
        $scope.listBoxs   = []
        $http
          method: "POST"
          url:    options.api.base_url + "/getParameters"
          data:
            workflow: $scope.WORKFLOW_NAME
        .success (data) ->
            console.log data
            angular.forEach data.list, (value, key) ->
                if value.TYPE == "DropDown" || value.TYPE == "ListBox"
                    $scope.listBoxs.push value
                    angular.forEach $scope.listBoxs, (valueL, keyL) ->
                        if valueL.VALUE_TYPE != 'query'
                          listName = valueL.NAME
                          value = valueL.VALUE;
                          console.log value 
                          array = value.split("\n")
                          console.log array
                          # array.pop()
                          $scope[listName] = array
                          
                        else if valueL.VALUE_TYPE == 'query'
                            query = valueL.VALUE
                            $http
                              method: "GET"
                              url:    options.api.base_url + "/query/" + query
                            .success (data_query) ->
                                $scope.queries      = data_query
                                $scope.queries.NAME = valueL.NAME
                                $scope.go           = true
                            .error (err) ->
                              console.log err
                else
                    $scope.parameters.push value
                    $scope.go           = true
            for parameter in  $scope.parameters
              $scope.selected[parameter.NAME] = parameter.DEFAULT_VALUE
            angular.forEach data.listbox, (value, key) ->
                if value.TYPE == "DropDown" || value.TYPE == "ListBox"
                    $scope.listBoxs.push value
                    angular.forEach $scope.listBoxs, (valueL, keyL) ->
                        if valueL.VALUE_TYPE != 'query'
                          listName = valueL.NAME
                          value = valueL.VALUE;
                          array = value.split("\n")
                          # array.pop()
                          $scope[listName] = array
                        else if valueL.VALUE_TYPE == 'query'
                            query = valueL.VALUE
                            $http
                              method: "GET"
                              url:    options.api.base_url + "/query/" + query
                            .success (data_query) ->
                                $scope.queries      = data_query
                                $scope.queries.NAME = valueL.NAME
                                $scope.go           = true
                            .error (err) ->
                              console.log err
                else
                    $scope.parameters.push value
                    $scope.go           = true
            for parameter in  $scope.parameters
              $scope.selected[parameter.NAME] = parameter.DEFAULT_VALUE
        .error (err) ->
          console.log err

    $scope.return_html = (parameter) ->
        html = null
        info = parameter.NAME
        if parameter.TYPE == "Date"
          html = """  <div class="col s6">
                        <div class="row">
                          <label class="">""" + parameter.LIBELLE + """</label>
                          <datepicker date-format="yyyy-MM-dd" date-set="  """ + $scope.today + """  " class="ng-isolate-scope">
                            <input class="input_workflow" style="width: 90%;border: 3px solid rgba(158, 158, 158, 0.407843);background-color: white;padding-left: 5px;" ng-model=" selected.""" + info +  """ " type="text"/>
                          </datepicker>
                        </div>
                      </div> """
        else if parameter.TYPE == "FileBrowse"
          html = """      <div class="file-field input-field">
                            <div class="file_workflow btn">
                              <i class="material-icons">input</i>
                              <input file-model=" file.""" + info +  """" type="file" multiple>
                            </div>
                            <div class="file-path-wrapper">
                              <input file-model=" file.""" + info +  """" class="file-path validate" type="text" placeholder="Uploader un ou plusieurs fichiers">
                            </div>
                          </div>
                       """
        else if parameter.TYPE == "TextBox"
          html = """  <div class="col s12">
                        <div class="row">
                          <label  class=" labelstyle">{{parameter.LIBELLE}}</label>
                          <md-input-container class="md-block">
                            <input class="input_workflow" ng-model=" selected.""" + info +  """" aria-label="email" type="text" ng-pattern="word" style="margin: 0;height: 50px;border: 3px solid rgba(158, 158, 158, 0.407843);background-color: white;padding-left: 5px;" name="mail" required="">
                          </md-input-container>
                   			</div>
                      </div> """
        else if parameter.TYPE == "BooleanGroup"
          html = """  <div style="margin-bottom:25px"  class="col s4">
                        <div class="row">
                            <md-switch style="margin-left:5px;"ng-model=" selected.""" + info +  """" aria-label="BooleanGroup">
                              {{parameter.LIBELLE}}
                            </md-switch>
                   			</div>
                      </div> """
        html = $sce.trustAsHtml html

    $scope.return_html_listBox = (parameter) ->
      if parameter.NAME != "SiteID"
        listName = parameter.NAME
        libelle = parameter.LIBELLE
        value = parameter.VALUE;
        # value = value.replace /^\n+|\n+$/g,""
        array = value.split("\n")
        array.pop()
        $scope[listName] = array
        if parameter.TYPE == 'ListBox' && parameter.MULTIPLE_CUSTOM == "False"
          html = """  <div style="margin-top:10px" class="col s12">
                        <div class="row">
                          <label class="">""" + libelle + """</label>
                          <fieldset class="fieldset">
                            <md-input-container ng-repeat="data in """ + listName + """" class="col s6">
                              <md-checkbox ng-model="selected.""" + listName +  """[data]" aria-label="CheckBoxList">
                                {{data}}
                              </md-checkbox>
                            </md-input-container>
                          </fieldset>
                        </div>
                      </div> """
        else if parameter.TYPE == 'ListBox' && parameter.MULTIPLE_CUSTOM == "True"
          html = """  <div style="margin-top:10px" class="col s12">
                          <div class="row">
                            <label class="">""" + libelle + """</label>
                            <fieldset class="fieldset">
                              <md-input-container ng-repeat="data in """ + listName + """" class="col s6">
                                <md-checkbox ng-model=" multiple_custom.""" + listName +  """[data]" aria-label="CheckBoxList">
                                  {{data}}
                                </md-checkbox>
                              </md-input-container>
                            </fieldset>
                          </div>
                        </div> """
        else if parameter.TYPE == 'DropDown'
          html = """  <div class="col s12">
                        <div class="row">
                          <label  class="">""" + libelle + """</label>
                          <md-input-container class="col s6" style="margin-right: 10px;margin-bottom: 10px;width:100%;height: 50px;border: 3px solid rgba(158, 158, 158, 0.407843);background-color: white;padding-left: 5px;">
                            <md-select aria-label="$index" style="height: 50px;" ng-model=" selected.""" + listName +  """">
                              <md-option ng-repeat="data in """ + listName + """" value="{{data}}">{{data}}</md-option>
                            </md-select>
                          </md-input-container>
                        </div>
                      </div> """
        html = $sce.trustAsHtml html
    isNotEmpty = (obj) ->
      for prop of obj
        if obj.hasOwnProperty(prop)
          return true

    $scope.submit = () ->
        $scope.height          = $('#main').height()
        $scope.height          = $scope.height - 50
        $scope.height_circular = $scope.height / 1.4
        $scope.height_circular = $scope.height_circular + "px"
        $scope.height          = $scope.height + "px"
        $scope.displayload     = true
        $scope.string          = " "
        multiple               = {}
        angular.forEach $scope.listBoxs, (valueL, keyL) ->
            if valueL.MULTIPLE_CUSTOM == "True"
                $scope.string             = valueL.MULTIPLE_START
                $scope.multiple_separator = valueL.MULTIPLE_SEPARATOR
                $scope.multiple_end       = valueL.MULTIPLE_END
                $scope.multiple_name      = valueL.NAME
        angular.forEach $scope.multiple_custom, (value, key) ->
          data      = Object.keys(value)
          if data.length > 0
            angular.forEach data, (valueD, key) ->
              $scope.string += valueD + $scope.multiple_separator
            $scope.string =  $scope.string.substring(0, $scope.string.length - 1)
        $scope.string += $scope.multiple_end
        multiple[$scope.multiple_name] = $scope.string
        if $scope.multiple_name
            $scope.selected    = angular.merge(multiple,$scope.selected)
        string = "@travelplanet.fr"

        # if isNotEmpty($scope.file)
        #     if $scope.infosWokflow.length >= 1
        #         $scope.selected['path']          = $scope.infosWokflow[0].PATH
        #         $scope.selected['type']          = $scope.infosWokflow[0].TYPE
        #         $scope.selected['workflow_name'] = $scope.WORKFLOW_NAME
        #         # if  $scope.selected.TP_MAIL.indexOf(string) != -1
        #         #     json_data = JSON.stringify($scope.selected).replace(/\\n|\\r/g, "")
        #         #     console.log json_data
        #         #     $http
        #         #       method: "POST"
        #         #       url:    "http://api-interne.travelplanet.fr/api/Alteryx/Workflow"
        #         #       data:
        #         #         json_data : json_data
        #         #         file      : $scope.file
        #         #       transformResponse: [ (data) ->
        #         #         console.log data
        #         #       ]
        #         #     .success (data) ->
        #         #         console.log data
        #         #         alertFct.okCreateFactory()
        #         #         $scope.displayload = false
        #         #     .error (err) ->
        #         #         console.log "une error est survenue"
        #         # else
        #         #   alertFct.alertSend()
        # else
        if $scope.infosWokflow.length >= 1
            $scope.selected['path']          = $scope.infosWokflow[0].PATH
            $scope.selected['type']          = $scope.infosWokflow[0].TYPE
            $scope.selected['workflow_name'] = $scope.WORKFLOW_NAME
            if  $scope.selected.TP_MAIL.indexOf(string) != -1
                console.log "postWorkflow"
                json_data = JSON.stringify($scope.selected).replace(/\\n|\\r/g, "")
                console.log json_data
                $http
                  method: "POST"
                  url:    options.api.base_url + "/postWorkflow"
                  data:
                    json_data: json_data
                .success (data) ->
                    console.log data
                    alertFct.okCreateFactory()
                    $scope.displayload = false
                .error (err) ->
                    console.log "une error est survenue"
            else
              alertFct.alertSend()