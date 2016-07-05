# tableau
# .service 'ticketGeneratorFactory', ($http) ->
#     getTicket: (url, username, site) ->
#         $http
#             method: 'POST'
#             url:    url
#             data:
#                 username: username
#                 site:     site
#         .then (response) ->
#             return response.data
#         .catch (err) ->
#             throw err
