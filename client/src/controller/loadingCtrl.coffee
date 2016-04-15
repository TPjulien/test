tableau
.controller 'loadingCtrl', ($scope) ->
    # t = 0
    #
    # moveit = ->
    #   t += 0.05
    #   r = 100
    #   xcenter = 100
    #   ycenter = 100
    #   newLeft = Math.floor(xcenter + r * Math.cos(t))
    #   newTop = Math.floor(ycenter + r * Math.sin(t))
    #   $('#friends').animate {
    #     top: newTop
    #     left: newLeft
    #   }, 1, ->
    #     moveit()
    #     return
    #   return
    #
    # $(document).ready ->
    #   moveit()
    #   return
    # $div   = $('test')
    # $canvas = document.getElementById('canvas')
    # $ship = $div.find('img')
    # console.log($canvas)
    # ctx  = $canvas
    #
    #
    #
    # # console.log "vous passez par ici !"
    # # $scope.draw = () ->
    # #   console.log ("vous avez cliqué ici !")
    # # $('#ellipse-a').click (e) ->
    # # e.preventDefault()
    # # stop()
    # tween    $.curve.ellipse,
    #   x:     $canvas[0].width / 2
    #   y:     $canvas[0].height / 2
    #   major: $canvas[0].width / 2 - 10
    #   minor: $canvas[0].height / 2 - ($canvas[0].height * .2)
