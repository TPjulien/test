tableau
.controller 'profilCreateCtrl', ($scope) ->
    # $scope.user = {}
    $scope.steps = [
      {
        # templateUrl: '/modals/stepsCreateUser/stepmandatory.html'
         templateUrl: '/views/stepsCreateUser/stepmandatory.html'
        # title:       'Profil utilisateur'
      }
      {
        templateUrl:   '/modals/stepsCreateUser/optionalstep.html'
        hasForm:       true
        isolatedScope: true
        controller:    'isolatedStepCtrl'
        title:         ''
      }

    ]


    # console.log $scope.user
    $scope.test = () ->
        console.log $scope.user
        console.log $scope.gender
        alert salut
