tableau
.controller 'loginCtrl', ($scope, $http, jwtHelper, store, auth, $location, SweetAlert, alertFct, $mdDialog, ipFct) ->
    $location.path "/login/account"
