tableau
.factory 'redirectInterceptor', ($q, $location, $window) ->
  { 'response': (response) ->
    if typeof response.data == 'string' and response.data.indexOf('My Login Page') > -1
      $window.location.href = '/login.html'
      $q.reject response
    else
      response
 }
