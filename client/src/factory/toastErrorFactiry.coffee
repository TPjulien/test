tableau
.factory 'toastErrorFct', ($mdToast) ->
    toastError: (value) ->
        $mdToast.show(
            $mdToast.simple()
                .textContent value
                .position 'bottom right'
                .hideDelay 3000
        )
