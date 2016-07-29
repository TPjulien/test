tableau.
directive 'dynamicController', [
  '$controller'
  ($controller) ->
    {
      restrict: 'A'
      scope: true
      link: (scope, element, attrs) ->
        locals =
          $scope: scope
          $element: element
          $attrs: attrs
        element.data '$Controller', $controller(scope.$eval(attrs.dynamicController), locals)
        return

    }
]
