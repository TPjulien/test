var mysql     = require('mysql');
var http_post = require('http-post');
var request   = require('request');
var fs        = require('fs');

module.exports = function(router, connection) {
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
                  var request_two = "SELECT * FROM ?? WHERE ?? = ? AND ?? =?";
                  var table_two   = ["tp_control.embed", "SITE_ID", site_id, "VIEW_ID", view_id];
                  request_two     = mysql.format(request_two, table_two);
                  connection.query(request_two, function(err, result_embed_content_type) {
                      if (err)
                          res.status(400).send(err);
                      else {
                          // On build un JSON generique donner au client
                          var object           = {};
                          var count            = result_embed_content_type.length;
                          // Ici on dit si c'est un datatable, un tableau, ou bien un embed dont on ne connait pas la nature
                          object.datatable     = [];
                          object.tableau       = [];
                          object.others        = [];
                          // cette boucle permet
                          for (var i = 0; i < count; i++) {
                              if (result_embed_content_type[i].embed_content_type == 'datatable') {
                                  object.datatable.push(result_embed_content_type[i]);
                              }
                              else if (result_embed_content_type[i].embed_content_type == 'tableau') {
                                  object.tableau.push(result_embed_content_type[i]);
                              }
                              else {
                                  object.others.push(result_embed_content_type[i]);
                              }
                          }
                          // Un foreach pour recuperer que les donnée 'clean'
                          var values, result;
                          var object_final = []
                          // on nettoie les données inutiles
                          for (values in object) {
                            result = object[values];
                            if (result.length !== 0) {
                              for (var i = 0; i < result.length; i++) {
                                object_final.push(result[i]);
                              }
                            }
                          }
                          // On envoie au client les types d'embed pour qu'il puisse generer automatiquement les vues et renvoyer d'autres instructions
                          res.json(object_final);
                      }
                  })
                }
            })

        })

    // Nouvelle route pour menu
    router.route('/getMenu')
        .post(function(req, res) {
            var user_auth = req.body.user_auth;
            var site_id   = req.body.site_id;
            var user_id   = req.body.user_id;
            // Faire une view plus tard
            var query     = "SELECT * FROM ?? WHERE ?? IN \
                              ( SELECT DISTINCT ?? FROM ?? WHERE ?? IN \
                                ( SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ? ) \
                                AND ?? = ? ) \
                              AND ?? = ?";
            var table     = ["tp_control.View_WIP", "VIEW_ID",
                             "view_id", "tp_control.View_Role_WIP", "ROLE_ID",
                             "ROLE", "tp_control.user_roles", "SITE_ID", site_id, "USER_ID", user_id,
                             "SITE_ID", site_id,
                             "SITE_ID", site_id];
            query         = mysql.format(query, table);
            connection.query(query, function(err, result_menu) {
                if (err)
                    res.status(400).send(err);
                else {
                    res.json(result_menu);
                }
            })
        })

    // Permet de recuperer la route si jamais il y a plus de 1 tableau
    router.route('/getMultipleView/:view_id/:site_id')
        .get(function(req, res) {
            var query  = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
            var table  = ["tp_control.embed_embed_view_WIP", "VIEW_ID", req.params.view_id, "SITE_ID", req.params.site_id];
            query      = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
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
