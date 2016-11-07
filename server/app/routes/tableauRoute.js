var http_post = require('http-post');
var request   = require('request');

module.exports = function(router, connection, mysql) {
    router.route('/getTableau')
        .post(function(req, res) {
            var query    = "SELECT * FROM ?? \
                              WHERE ?? = ?";
            var table    = ['click_dash_base.click_Tableau',
                            'EMBED_ID', req.body.embed_id];
            query = mysql.format(query, table);
            connection.query(query, function(err, result_datatable) {
                if(err) {
                    res.status(400).send(err);
                } else if (result_datatable.length == 0)
                    res.status(404).send('La ressource demandé est introuvable.');
                else {
                  var user_site = "";
                  if (result_datatable[0].tableau_site != "Default") {
                      user_site = result_datatable[0].tableau_site;
                  var username = "";
                  // condition si jamais ce n'est pas un customer
                  if (result_datatable[0].tableau_site == "Customer") {
                      username = req.body.get_user_name
                  } else {
                      username = result_datatable[0].tableau_user_id;
                  }
                  var options = {
                      url: 'https://' + result_datatable[0].tableau_server_url + '/trusted',
                      form : {
                        username    : username,
                        target_site : user_site
                      }
                  }
                  // get token for each tableau in row
                  request.post(options, function(err, resultat, body) {
                    if (body != '' || body != undefined || body != null) {
                        var resultObject = { "SITE_ID"            : result_datatable[0].SITE_ID,
                                             "VIEW_ID"            : result_datatable[0].VIEW_ID,
                                             "EMBED_ID"           : result_datatable[0].EMBED_ID,
                                             "tableau_site"       : result_datatable[0].tableau_site,
                                             "tableau_view"       : result_datatable[0].tableau_view,
                                             "tableau_user_id"    : result_datatable[0].tableau_user_id,
                                             "tableau_server_url" : result_datatable[0].tableau_server_url,
                                             "token"              : body
                                       };
                        res.json(resultObject);
                    } else {
                        res.status(404).send('élement introuvable !');
                    }
                })
           }
      })
    })
}
