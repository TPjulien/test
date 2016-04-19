tableau
.directive 'drawing', ->
  {
    restrict: 'A'
    link: (scope, element) ->
      ship = new Image()
      #  init instance
      angle    = 0
      rangeX   = 30
      rangeY   = 10
      rangeTwoX = 150
      rangeTwoY = 50
      speed    = 2
      ctx      = element[0].getContext('2d')
      cx       = 200
      radius   = 40
      cy       = 75
      angle    = 0
      centerX  = element[0].width / 2
      centerY  = element[0].height / 2
      to_radiant = Math.PI/180
      init = () ->
          ship.src = "/img/icons/plane_fixed.png"
          window.requestAnimationFrame(animate)

      # drawing the ship
      draw = (rotationY, rotationX, shipAngle) ->
          ctx.clearRect(0, 0, element[0].width, element[0].height)
          ctx.save()
          ctx.beginPath()
          ctx.translate(rotationX, rotationY)
          ctx.rotate(shipAngle)
          ctx.drawImage(ship, -50, -50, 92, 92)
          ctx.stroke()
          ctx.restore()

      animate = () ->

          ctx.clearRect(0,0, element[0].width, element[0].height)

          newX =  Math.cos((90 + angle) * to_radiant) * rangeX
          newY =  Math.sin((90 + angle) * to_radiant) * rangeY

          rotationX = centerX - Math.cos(angle * to_radiant) * rangeTwoX
          rotationY = centerY + Math.sin(angle * to_radiant) * rangeTwoY

          if angle > 0 && angle < 180
              drawAngle = -Math.atan(-rangeY / (rangeX * Math.tan(angle * to_radiant)))
          else if angle > 180 && angle < 360
              drawAngle = Math.PI + Math.atan(-rangeY / (rangeX * Math.tan((-angle - 180) * to_radiant)))
          else if angle == 180
              drawAngle = -90
          else
              drawAngle = 90


          if angle + speed > 360
              angle = 0
          else
              angle += speed

          # drawing the animated ship
          draw(rotationY, rotationX, drawAngle)

          requestAnimationFrame(animate)

        window.requestAnimationFrame(animate)

      init()
  }
