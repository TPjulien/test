tableau
.factory 'redirectInterceptor', ($q, $location, $window) ->
  { 'response': (response) ->
    if typeof response.data == 'string' and response.data.indexOf('My Login Page') > -1
      console.log 'LOGIN!!'
      console.log response.data
      $window.location.href = '/login.html'
      $q.reject response
    else
      response
 }
