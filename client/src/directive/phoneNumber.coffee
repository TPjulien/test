tableau
.directive 'phoneInput', ($filter, $browser) ->
  {
    require: 'ngModel'
    link: ($scope, $element, $attrs, ngModelCtrl) ->

      listener = ->
        value = $element.val().replace(/[^0-9]/g, '')
        $element.val $filter('tel')(value, false)
        return

      # This runs when we update the text field
      ngModelCtrl.$parsers.push (viewValue) ->
        viewValue.replace(/[^0-9]/g, '').slice 0, 10
      # This runs when the model gets updated on the scope directly and keeps our view in sync

      ngModelCtrl.$render = ->
        $element.val $filter('tel')(ngModelCtrl.$viewValue, false)
        return

      $element.bind 'change', listener
      $element.bind 'keydown', (event) ->
        key = event.keyCode
        # If the keys include the CTRL, SHIFT, ALT, or META keys, or the arrow keys, do nothing.
        # This lets us support copy and paste too
        if key == 91 or 15 < key and key < 19 or 37 <= key and key <= 40
          return
        $browser.defer listener
        # Have to do this or changes don't get picked up properly
        return
      $element.bind 'paste cut', ->
        $browser.defer listener
        return
      return

  }
