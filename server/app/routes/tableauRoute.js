var mysql     = require('mysql');
var http_post = require('http-post');
var request   = require('request');

module.exports = function(router, connection) {
    router.route('/getTableau')
        .post(function(req, res) {
            var query    = "SELECT * FROM ?? \
                              WHERE ?? = ?";
            var table    = ['tp_control.Tableau_WIP',
                            'EMBED_ID', req.body.embed_id];
            query = mysql.format(query, table);
            connection.query(query, function(err, result_datatable) {
                if(err)
                    res.status(400).send(err);
                else if (result_datatable.length == 0)
                    res.status(404).send('La ressource demandé est introuvable.');
                else {
                  var user_site = null;
                  if (result_datatable[0].tableau_site == "Default") {
                      user_site = '';
                  } else
                      user_site = result_datatable[0].tableau_site;

                  var options = {
                      url: 'https://' + result_datatable[0].tableau_server_url + '/trusted',
                      form : {
                        username    : result_datatable[0].tableau_user_id,
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
                    } else
                        res.status(404).send('élement introuvable !');
                    //   resultObject[counter] = {  "site_id"             : rows[counter].site_id,
                    //                              "view_id"             : rows[counter].view_id,
                    //                              "embed_id"            : rows[counter].embed_id,
                    //                              "path_to_view"        : rows_tableau[counter].path_to_view,
                    //                              "embed_width"         : rows[counter].embed_width,
                    //                              "embed_height"        : rows[counter].embed_height,
                    //                              "embed_position"      : rows[counter].embed_position,
                    //                              "embed_content_type"  : rows[counter].embed_content_type,
                    //                              "tableau_customer_id" : rows_tableau[counter].tableau_customer_id,
                    //                              "auth_user_role"      : rows[counter].auth_user_role,
                    //                              "token"               : body
                    // };
                    // if (counter == (rows_tableau.length - 1)) {
                    //     res.json(resultObject);
                    // }
                })
           }
      })
    })
}
