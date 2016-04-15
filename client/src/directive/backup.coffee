# tableau
# .directive 'drawing', ->
#   {
#     restrict: 'A'
#     link: (scope, element) ->
#       ship = new Image()
#       #  init instance
#       dd       = 3
#       angle    = 0
#       rangeX   = 150
#       rangeY   = 50
#       speed    = 0.02
#       ctx      = element[0].getContext('2d')
#       cx       = 200
#       radius   = 40
#       cy       = 75
#       angle    = 0
#       centerX  = element[0].width / 2
#       centerY  = element[0].height / 2
#       init = () ->
#           ship.src = "/img/icons/plane.png"
#           # calling animation
#           window.requestAnimationFrame(animate)
#
#       # drawing the ship
#       draw = (x, y) ->
#           ctx.clearRect(0, 0, element[0].width, element[0].height)
#           ctx.save()
#           ctx.beginPath()
#           ctx.beginPath()
#           ctx.drawImage(ship, x-50, y-30, 48, 48)
#           ctx.fill()
#           ctx.stroke()
#           ctx.restore()
#
#       animate = () ->
#
#           ctx.clearRect(0,0, element[0].width, element[0].height)
#
#           newX = centerX + Math.cos(angle) * rangeX
#           newY = centerY + Math.sin(angle) * rangeY
#
#           angle += speed
#
#           draw(newX, newY)
#
#           # console.log newY
#           # console.log newX
#
#           ctx.beginPath()
#           ctx.ellipse(200, 100, 75, 200, 80 * Math.PI/180, 0, 2 * Math.PI )
#           ctx.closePath()
#           ctx.stroke()
#           requestAnimationFrame(animate)
#
#         window.requestAnimationFrame(animate)
#
#       init()
#   }
