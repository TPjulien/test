var mysql     = require('mysql');
var http_post = require('http-post');
var request   = require('request');
var fs        = require('fs');


module.exports = function(router, connection) {
    // une fonction qui retourne une queryBuilder en fonction de la requete donnée
    function queryBuilder(data) {
        var query = "ceci est un test de query";
        return query;
    }
    // structure tableau v2
    // On utilise un post au lieu d'un GET
    router.route('/showEmbed')
        .post(function(req, res) {
            // la premiere étape consiste à verifier le role de l'utilisateur
            var user_role = req.body.user_role;
            var view_id   = req.body.view_id;
            var site_id   = req.body.site_id;
            // on prepare la premiere requete pour verifier
            var request_one = "SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ?";
            var table_one   = ["ROLE", "tp_control.embed_roles", "SITE_ID", site_id, "ROLE", user_role, "VIEW_ID", view_id];
            request_one     = mysql.format(request_one, table_one);
            connection.query(request_one, function(err, result_roles) {
                // si jamais il y a une erreur ou bien que le tableau est vide, on retourne un status 400, 404
                if (err)
                    res.status(400).send(err);
                else if (result_roles.length == 0)
                    res.status(404).send("Not Found");
                else {
                  // une fois passé l'etape 1, on verifie de quel embed il s'agit, si jamais c'est un tableau ou bien autre chose qu'un tableau
                  var request_two = "SELECT DISCTINCT(??) FROM ?? WHERE ?? = ? AND ?? =?";
                  var table_two   = ["embed_content_type", "tp_control.embed", "SITE_ID", site_id, "VIEW_ID", view_id];
                  request_two     = mysql.format(request_two, table_two);
                  connection.query(request_two, function(err, result_embed_content_type) {
                      if (err)
                          res.status(400).send(err);
                      else {
                          // la on regarde si c'est un tableau ou bien autre chose
                          if (result_embed_content_type == "tableau") {

                          } else if (result_embed_content_type == "datatable") {
                              // si jamais le content_type c'est un datatable
                              var request_datatable = "SELECT * FROM ?? WHERE ?? =? AND ?? =?";
                              var table_datatable   = ["tp_control.datatable", "SITE_ID", site_id, "VIEW_ID", view_id];
                              request_datatable     = mysql.format(request_datatable, table_datatable);
                              connection.query(request_datatable, function(err, result_datatable) {
                                  if (err)
                                      res.status(400).send(err);
                                  else {
                                      res.json(result_datatable);
                                  }
                              })
                          } else {
                              // dans tout les autres cas
                              res.send("Test");
                          }
                      }
                  })
                }

            })

        })

    router.route('/getViewSite/:site/:role_id')
        .get(function(req, res) {
            var auth_id      = "ai."        + req.params.role_id;
            var view_auth_id = "aei.embed_" + req.params.role_id;
            var query        = "select DISTINCT * from ?? WHERE ?? = ? AND ?? = ?";
            var table        = ['view_menu_auth_role', 'auth_user_role', req.params.role_id, 'site_id', req.params.site];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: err })
                } else {
                    res.json(rows);
                }

            })
        })

    // route pour avoir toutes les
    router.route('/getListTemplate/:site_id/:view_id')
        .get (function(req, res) {
            var request = "SELECT ??,??,??,?? FROM ?? WHERE ?? = ? AND ?? = ?";
            var tableau = ["site_id", "view_id", "embed_id", "tableau_libelle", "tableau_info", "site_id", req.params.site_id, "view_id", req.params.view_id];
            request     = mysql.format(request, tableau);
            connection.query(request, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })

    // route pour avoir un seul template
    router.route('/getTemplateView/:user/:site/:site_id/:view_id/:embed_id/:auth_role')
        .get (function (req, res)  {
          var query_one = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ?";
          var table_one = ["embed_generic_info", "view_id", req.params.view_id, "site_id", req.params.site_id, "embed_id", req.params.embed_id];
          query_one     = mysql.format(query_one, table_one);
          connection.query(query_one, function(err, rows_one) {
              if (err)
                  res.status(400).send(err);
              else {
                  var query_two = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ? AND ?? = ?";
                  var table_two = ['tableau_view_info', 'view_id', req.params.view_id, 'site_id', req.params.site_id, 'auth_user_role', req.params.auth_role, "embed_id", req.params.embed_id];
                  query_two     = mysql.format(query_two, table_two);
                  connection.query(query_two, function(err, rows_two) {
                      if (err)
                          res.status(400).send(err);
                      else {
                        var site = req.params.site;
                        if (site == "Default")
                          site = "";
                        var options = {
                                                  url: 'https://data.travelplanet.fr/trusted',
                          /*cert: fs.readFileSync('/etc/ssl/tp_control/tp-control_travelplanet_fr.crt'),
                                                  key:  fs.readFileSync('/etc/ssl/tp_control/ia.key'),
                                                  ca:   fs.readFileSync('/etc/ssl/tp_control/DigiCertCA.crt'),*/
                                                  form : {
                                                    username: req.params.user,
                                                    target_site: site
                                                  }
                                        }
                        request.post(options, function(err, resultat, body) {
                                if (err)
                                    res.send(400).send(err)
                                else {
                                    resultObject = {         "site_id"             : rows_one[0].site_id,
                                                             "view_id"             : rows_one[0].view_id,
                                                             "embed_id"            : rows_one[0].embed_id,
                                                             "path_to_view"        : rows_two[0].path_to_view,
                                                             "embed_width"         : rows_one[0].embed_width,
                                                             "embed_height"        : rows_one[0].embed_height,
                                                             "embed_position"      : rows_one[0].embed_position,
                                                             "embed_content_type"  : rows_one[0].embed_content_type,
                                                             "tableau_customer_id" : rows_two[0].tableau_customer_id,
                                                             "auth_user_role"      : rows_two[0].auth_user_role,
                                                             "token"               : body,
                                                             "test"                : 'test-token'
                                                           };
                                    res.json(resultObject);
                                }

                        })

                      }
                  })
              }
          })
        })

    router.route('/currentView/:user/:site/:customer/:view/:auth_role/:user_id')
        .get (function(req, res) {
            var completed_requests = 0;
	          var second_requests    = 0;
            var element            = {};
            var final_object       = [];
            var query              = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ?";
            var table              = ['embed_generic_info', 'view_id', req.params.view, 'site_id', req.params.customer, 'auth_user_role', req.params.auth_role];
            query                  = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.status(400).send(err);
                } else if (rows.length == 0) {
                    res.status(404).send("Not found !");
                } else {
                  if (rows[0].embed_content_type == "Tableau") {
                    // Get only the necessary data (generic data)
                    var query_two = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ?";
                    var table_two = ['tableau_view_info', 'view_id', req.params.view, 'site_id', req.params.customer, 'auth_user_role', req.params.auth_role];
                    query_two     = mysql.format(query_two, table_two);
                    connection.query(query_two, function(err, rows_tableau) {
                        if (err) {
                          res.status(400).send("Bad Realm !");
                        } else if (rows_tableau.length == 0) {
                          res.status(404).send("Not Found !");
                        } else {
                          resultObject = {};
                          counter     = 0;
                          for (items in rows_tableau) {
                              var site = req.params.site;
                              if (site == "Default")
                                site = "";
                              var options = {
                                  url: 'https://' + rows_tableau[counter].tableau_server_url + '/trusted',
				  /*cert: fs.readFileSync('/etc/ssl/tp_control/tp-control_travelplanet_fr.crt'),
                                  key:  fs.readFileSync('/etc/ssl/tp_control/ia.key'),
                                  ca:   fs.readFileSync('/etc/ssl/tp_control/DigiCertCA.crt'),*/
                                  form : {
                                    username: req.params.user,
                                    target_site: site
                                  }
                              }
                              // get token for each tableau in row
                              request.post(options, function(err, resultat, body) {
                                  resultObject[counter] = {  "site_id"             : rows[counter].site_id,
                                                             "view_id"             : rows[counter].view_id,
                                                             "embed_id"            : rows[counter].embed_id,
                                                             "path_to_view"        : rows_tableau[counter].path_to_view,
                                                             "embed_width"         : rows[counter].embed_width,
                                                             "embed_height"        : rows[counter].embed_height,
                                                             "embed_position"      : rows[counter].embed_position,
                                                             "embed_content_type"  : rows[counter].embed_content_type,
                                                             "tableau_customer_id" : rows_tableau[counter].tableau_customer_id,
                                                             "auth_user_role"      : rows[counter].auth_user_role,
                                                             "token"               : body
                                };
                                if (counter == (rows_tableau.length - 1)) {
                                    res.json(resultObject);
                                }
                                counter++;
                              });
                          }
                        }
                    });
                  } else if (rows[0].embed_content_type == "Factures" ) {
                      var query_three = "SELECT * FROM ?? WHERE ?? = ?";
                      var table_three = ['factures_view_info', 'client_id', req.params.customer];

                      query_three     = mysql.format(query_three, table_three);
                      connection.query(query_three, function(err, rows_Factures) {
                          if (err) {
                              res.status(400).send(err);
                          } else if (rows_Factures == 0) {
                              res.status(404).send("Not Found !");
                          } else {
                            resultObject    = {};
                            resultObject[0] = {
                                "site_id"                            : rows[0].site_id,
                                "view_id"                            : rows[0].view_id,
                                "embed_id"                           : rows[0].embed_id,
                                "embed_width"                        : rows[0].embed_width,
                                "embed_height"                       : rows[0].embed_height,
                                "embed_content_type"                 : rows[0].embed_content_type,
                                "embed_position"                     : rows[0].embed_position,
                                "rules_filter_canFilterDate"         : rows_Factures[0].rules_filter_canFilterDate,
                                "rules_filter_canFilterType"         : rows_Factures[0].rules_filter_canFilterType,
                                "rules_filter_canFilterNameClient"   : rows_Factures[0].rules_filter_canFilterNameClient,
                                "rules_filter_canFilterNumberClient" : rows_Factures[0].rules_filter_canFilterNumberClient,
                                "rules_filter_canFilterPRice"        : rows_Factures[0].rules_filter_canFilterPRice,
                                "facture_column_canUseFacNum"        : rows_Factures[0].facture_column_canUseFacNum,
                                "facture_column_canUseTraveller"     : rows_Factures[0].facture_column_canUseTraveller,
                                "facture_column_canUseDateFrom"      : rows_Factures[0].facture_column_canUseDateFrom,
                                "facture_column_canUseAccountNumber" : rows_Factures[0].facture_column_canUseAccountNumber,
                                "facture_column_canUseInvoiceType"   : rows_Factures[0].facture_column_canUseInvoiceType,
                                "facture_column_canUseSupplier"      : rows_Factures[0].facture_column_canUseSupplier,
                                "facture_column_canUseTotalAmount"   : rows_Factures[0].facture_column_canUseTotalAmount
                            };
                            res.json(resultObject);
                          }
                      });
                  // on verifie si c'est reclamation
                  } else if (rows[0].embed_content_type == "Reclamation") {
                      var query_one = "SELECT * FROM ?? WHERE ?? =? AND ?? =?";
                      var table_one = ['embed_generic_info', 'embed_content_type', 'Reclamation', 'auth_user_role', req.params.auth_role];
                      query_one = mysql.format(query_one, table_one);
                      connection.query(query_one, function(err, result) {
                          if (err)
                              res.status(400).send(err);
                          else
                              res.json(result);
                      })
                  } else if (rows[0].embed_content_type == "iframe") {
                      var query_one = "SELECT * FROM ?? WHERE ?? = ? AND ?? =?";
                      var table_one = ['embed_generic_info', 'embed_content_type', 'iframe', 'auth_user_role', req.params.auth_role];
                      query_one     = mysql.format(query_one, table_one);
                      connection.query(query_one, function(err, result) {
                          if (err)
                              res.status(400).send(err);
                          else
                              res.json(result);
                      })
                  } else if (rows[0].embed_content_type == 'profils') {
                    var query_one = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
                    var table_one = ['embed_generic_info', 'embed_content_type', 'profils', 'auth_user_role', req.params.auth_role];
                    query_one     = mysql.format(query_one, table_one);
                    connection.query(query_one, function(err, result) {
                        if (err)
                            res.status(400).send(err);
                        else
                            res.json(result);
                    })
                  }
                }
              })
        });
}
