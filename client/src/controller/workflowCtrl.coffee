tableau
.controller 'workflowCtrl', ($scope, $http, $sce,alertFact) ->
    currentDate = new Date()
    day = currentDate.getDate()
    month = currentDate.getMonth() + 1
    year = currentDate.getFullYear()
    $scope.today =  year  + "-" + month + "-" +  day

    $scope.getdistinctWokflow = (schema) ->
        $http
          method: "GET"
          url:    options.api.base_url + "/distinctWokflow"
        .success (data) ->
          $scope.Distinctwokflows = data
        .error (err) ->
          console.log err
    $scope.getdistinctWokflow()

    $scope.infosWokflow = () ->
        $http
          method: "POST"
          url:    options.api.base_url + "/infosWokflow"
          data:
            workflow: $scope.WORKFLOW_NAME
        .success (data) ->
            $scope.infosWokflow = data
        .error (err) ->
          console.log err

    $scope.return_html = (parameter) ->
        html = null
        if parameter.TYPE == "Date"
          html = """  <div class="col s6">
                        <div class="row">
                          <label class="">""" + parameter.NAME + """</label>
                          <datepicker date-format="yyyy-MM-dd" date-set="  """ + $scope.today + """  " class="ng-isolate-scope">
                            <input style="width: 95%;border: 3px solid rgba(158, 158, 158, 0.407843);background-color: white;padding-left: 5px;" ng-model="parameter.VALUE" type="text"/>
                          </datepicker>
                        </div>
                      </div> """
        else if parameter.TYPE == "TextBox"
          html = """  <div class="col s12">
                        <div class="row">
                          <label  class=" labelstyle">{{parameter.NAME}}</label>
                          <md-input-container class="md-block">
                            <input aria-label="email" type="email" ng-pattern="word" style="height: 50px;border: 3px solid rgba(158, 158, 158, 0.407843);background-color: white;padding-left: 5px;" name="mail" ng-model="parameter.DEFAULT_VALUE" required="">
                          </md-input-container>
                   			</div>
                      </div> """
        html = $sce.trustAsHtml html
    $scope.return_html_listBox = (parameter) ->
        html = null
        if parameter[0].TYPE == 'ListBox'
          html = """  <div class="col s12">
                        <div class="row">
                          <label  class="">Selectionner une banque</label>
                          <md-input-container class="col s6" style="margin-right: 10px;width:100%;height: 50px;border: 3px solid rgba(158, 158, 158, 0.407843);background-color: white;padding-left: 5px;">
                            <md-select aria-label="$index" style="height: 50px;" ng-model="newbank">
                              <md-option ng-repeat="bank in banks track by $id(bank)" value="{{bank}}">{{bank}}</md-option>
                            </md-select>
                          </md-input-container>
                        </div>
                      </div> """
          html += """ <div class="col s12">
                        <div class="row" style="margin-top: 20px;margin-bottom: 20px;">
                          <md-button style="width: 100%;background: #138EFA;" ng-click="submit(newbank)"class="md-raised md-primary">Envoyer</md-button>
                        </div>
                      </div>"""
        html = $sce.trustAsHtml html

    $scope.getParameters = () ->
        $http
          method: "POST"
          url:    options.api.base_url + "/getParameters"
          data:
            workflow: $scope.WORKFLOW_NAME
        .success (data) ->
            $scope.parameters = data.list
            $scope.listBoxs   = data.listbox
        .error (err) ->
          console.log err

    $scope.getBanks = () ->
        $http
          method: "POST"
          url:    options.api.base_url + "/banks"
          data:
            workflow: $scope.WORKFLOW_NAME
        .success (data) ->
            data = data[0].VALUE
            array = []
            array = data.split(["\n"])
            array.pop()
            $scope.banks = array
        .error (err) ->
            console.log err

    $scope.submit = (newbank) ->
        error = 0
        myDATA = {}
        for parameter in $scope.parameters
          if parameter.NAME ==  'Email'
            string = "@travelplanet.fr"
            if parameter.DEFAULT_VALUE.indexOf(string) != -1
                myDATA[parameter.NAME] = parameter.DEFAULT_VALUE
            else
              alertFact.alertSend()
              error = 1
          else
            myDATA[parameter.NAME] = parameter.VALUE
        myDATA['path']          = $scope.infosWokflow[0].PATH
        myDATA['type']          = $scope.infosWokflow[0].TYPE
        myDATA['workflow_name'] = $scope.WORKFLOW_NAME
        myDATA['Bank']          = newbank
        json_data = JSON.stringify(myDATA);

        if error == 0
          $http
              method : 'POST'
              url    : options.api.base_url + '/workflow'
              data   :
                  workflow : json_data
          .success (data) ->
              alertFact.okCreateFactory()
          .error (err) ->
              console.error err
