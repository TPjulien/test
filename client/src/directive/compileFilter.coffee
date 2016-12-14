tableau
.directive 'filter', ($compile, $timeout) ->
  {
    restrict: 'A'
    link: (scope, elem, attrs) ->
      $timeout (->
        $compile(elem.contents()) scope
      ), 100
      return

    }
