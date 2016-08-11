tableau
.factory 'toastErrorFct', ($mdToast) ->
    toastError: (value) ->
        console.log "ça entre bien dans toast !"
        $mdToast.show(
            $mdToast.simple()
                .textContent value
                .position 'bottom right'
                .hideDelay 3000
        )
        # SweetAlert.swal {
        #           title: "Déconnexion"
        #           text:  "Ceci mettra fin à votre session, continuer ?"
        #           type:  "warning"
        #           showCancelButton: true
        #           confirmButtonColor: "#DD6B55"
        #           confirmButtonText: "Deconnexion"
        #           cancelButtonText: "Annuler"
        #           closeOnConfirm: true
        #           closeOnCancel: true
        #       }, (isConfirm) ->
        #         if isConfirm
        #           if store.get 'JWT'
        #               store.remove 'JWT'
        #               $location.path '/login/account'
        #               $rootScope.wallpaper = "url('https://wallpaperscraft.com/image/spots_background_light_blur_68629_1920x1080.jpg')"
        #           else
        #               $location.path '/login/account'
        #               $rootScope.wallpaper = "url('https://wallpaperscraft.com/image/spots_background_light_blur_68629_1920x1080.jpg')"
