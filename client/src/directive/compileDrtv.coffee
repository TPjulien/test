tableau
.directive 'compile', ($compile, $timeout) ->
  {
    restrict: 'A'
    link: (scope, elem, attrs) ->
      $timeout (->
        $compile(elem.contents()) scope
      ), 1000
      return

    }
