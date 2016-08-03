var mysql = require('mysql');
var http_post = require('http-post');
var request   = require('request');

module.exports = function(router, connection) {
    // get blob pdf
    router.route('/downloadPDF/:id_item')
        .get (function(req, res) {
            var query = "SELECT ?? from ?? WHERE ?? = ?";
            var table = ['blob', 'accelya.pdf', 'NUM_INVOICE', req.params.id_item];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error'})
                } else {
                    res.send(new Buffer(rows[0].blob, 'binary'))
                }
            })
        })
      router.route('/downloadPDFinserm/:num_invoice')
          .get (function(req, res) {
              var query = "SELECT ?? FROM ?? WHERE ?? = ?";
              var table = ['BLOB', 'accelya.vue_inserm', 'NUM_INVOICE', req.params.num_invoice];
              query     = mysql.format(query, table);
              connection.query(query, function(err, rows) {
                  if (err)
                      res.status(400).send("Bad realm !");
                  else
                      res.send(new Buffer(rows[0].BLOB, 'binary'));
              })
          })
      router.route('/getPDF/:limitMin/:limitMax')
          .get (function(req, res) {
              var min = req.params.limitMin
              var max = req.params.limitMax
              if (isNaN(min) || isNaN(max)) {
                res.status(404).send('unable to execute query');
              } else {
                var query = "select ??, ??, ??, SUM(??) AS TOTAL_AMOUNT, ?? from ?? GROUP BY ?? LIMIT " + req.params.limitMin + "," + req.params.limitMax;
                var table = ['SUPPLIER', 'FAC_TYPE', 'CREATION_DATE', 'AMOUNT', 'NUM_INVOICE', 'accelya.accelya_view_all', 'NUM_INVOICE'];
                query     = mysql.format(query, table);
                connection.query(query, function(err, rows) {
                    if (err) {
                        res.json({ message: 'error'})
                    } else {
                        res.json(rows);
                    }
                })
              }
          })
      router.route('/pdfFilter/:num_invoice/:min/:max')
          .get (function(req, res) {
              var min = req.params.min;
              var max = req.params.max;
              var invoice = req.params.num_invoice;
              if (isNaN(min)  || isNaN(max) || isNaN(invoice)) {
                res.status(404).send('unable to execute query');
              } else {
                var query = "SELECT ??, ??, ??, SUM(??) AS TOTAL_AMOUNT, ?? FROM ?? WHERE ?? LIKE '%" + invoice + "%' GROUP BY ?? LIMIT " + min + ',' + max;
                var table = ['SUPPLIER', 'FAC_TYPE', 'CREATION_DATE', 'AMOUNT', 'NUM_INVOICE', 'accelya.accelya_view_all', "NUM_INVOICE", "NUM_INVOICE"];
                query = mysql.format(query, table);
                connection.query(query, function(err, rows) {
                    if (err) {
                        res.json({ 'message': 'error' });
                    } else {
                        res.json(rows);
                    }
                })
              }
          })
      router.route('/pdfTypeFilter/:type/:min/:max')
          .get (function(req, res) {
              var min = req.params.min;
              var max = req.params.max;
              var type = req.params.type;
              if (isNaN(min) || isNaN(max)) {
                  res.status(404).send('unable to execute query');
              } else {
                var query = "SELECT ??, ??, ??, SUM(??) AS TOTAL_AMOUNT, ?? FROM ?? WHERE ?? = ? GROUP BY ?? LIMIT " + min + ',' + max;
                var table = ['SUPPLIER', 'FAC_TYPE', 'CREATION_DATE', 'AMOUNT', 'NUM_INVOICE', 'accelya.accelya_view_all', 'FAC_TYPE', type, "NUM_INVOICE"];
                query = mysql.format(query, table);
                connection.query(query, function(err, rows) {
                    if (err) {
                        res.json({ 'message' : 'error'})
                    } else {
                        res.json(rows);
                    }
                })
              }
          })

      // on recupere le filte séparément
      router.route('/getFilterDatatable/:site_id/:view_id/:embed_id')
          .get (function(req, res) {
            var query_filter = "SELECT ??,??,??,??,?? \
                                      FROM ?? \
                                      WHERE ?? = ? \
                                          AND ?? = ? \
                                          AND ?? = ?";
            var table_filter = ["has_date_filter","has_search_filter","has_bullet_filter", "has_amount_filter", "pdf_diplay",
                                "tp_control.datatable",
                                "SITE_ID", req.params.site_id,
                                "VIEW_ID", req.params.view_id,
                                "EMBED_ID", req.params.embed_id];
            query_filter = mysql.format(query_filter, table_filter);
            connection.query(query_filter, function(err, result_filter) {
                if (err)
                    res.status(400).send(err);
                else {
                    // deuxieme requete pour recuperer les colones utilisées
                    var query_filter_column = "SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ? AND ?? = ?";
                    var table_filter_column = ["column", "tp_control.datatable", "SITE_ID", req.params.site_id, "VIEW_ID", req.params.view_id, "EMBED_ID", req.params.embed_id];
                    query_filter_column = mysql.format(query_filter_column, table_filter_column);
                    connection.query(query_filter_column, function(err, result_filter_column) {
                        if (err)
                            res.status(400).send(err);
                        else
                            res.json({
                                      "datatable_filters" : result_filter,
                                      "column_filter"     : result_filter_column
                            });
                    })
                }
            })
          })
      // On Recupere les données de la datatable
      router.route('/getDatatable')
          .post (function(req, res) {
              // d'accord on cherche les données envoyé par le client puis une requete
              pre_data  = req.body.generic_data;
              filters   = req.body.filters;
              var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ? AND ?? =?";
              var table = ["tp_control.datatable", "SITE_ID", pre_data.SITE_ID, "VIEW_ID", pre_data.VIEW_ID, "EMBED_ID", pre_data.EMBED_ID];
              query = mysql.format(query, table);
              connection.query(query, function(err, result_datatable) {
                if (err)
                    res.status(400).send(err);
                else {
                    // on fait les traitement
                    var query_datatable = "SELECT ";
                    var table_datatable = [];
                    query_datatable += result_datatable[0].column;
                    for (var i = 1; i < result_datatable.length; i++) {
                        query_datatable += ', ' + result_datatable[i].column;
                    }
                    // deuxieme étape de la query builder
                    query_datatable += ' FROM ' + result_datatable[0].schema + '.' + result_datatable[0].table;
                    // condition si jamais le filter existe
                    if (filters.length != 0) {
                        for (name in filters) {
                            if (name == 0) {
                                // '%" + req.params.num_commande + "%'
                                query_datatable += ' WHERE ' + filters[name]['column_name'] + " LIKE '%" + filters[name]['value'] + "%' ";
                            } else {
                                query_datatable += ' AND ' + filters[name]['column_name'] + " LIKE '%" + filters[name]['value'] + "%' ";
                            }
                        }
                    }
                    // on fini la query avec limit
                    query_datatable += ' LIMIT ' + req.body.min + ',' + req.body.max;
                    // une fois la query buildé, on l'execute
                    connection.query(query_datatable, function(err, post_data){
                      if (err)
                          res.status(400).send(err);
                      else {
                            // on prend la datatable et aussi la largeur ainsi que le filtre de celui ci
                            res.json({
                                      'datatable'        : post_data,
                                      'datatable_width'  : result_datatable
                                    });
                          }
                    })
                 }
              })
          })



      // juju route
      router.route('/xmlandpdf/:min/:max/:num_invoice/:num_commande/:date_min/:date_max')
          .get (function(req, res) {
              var min  = req.params.min;
              var max  = req.params.max;
              // var type = req.params.type;
              if (isNaN(min) || isNaN(max)) {
                  res.status(404).send('unable to execute query');
              } else {
                var query = "SELECT ??,??,?? from ?? ";
                if (req.params.num_invoice != 'none')
                  var query  = query + "WHERE NUM_FACTURE LIKE '%" + req.params.num_invoice + "%' ";

                if (req.params.num_commande != "none" && req.params.num_invoice != "none")
                   var query = query + "AND NUM_COMMANDE LIKE '%" + req.params.num_commande + "%' ";
                else if (req.params.num_commande != "none" && req.params.num_invoice == "none")
                   var query = query + "WHERE NUM_COMMANDE LIKE '%" + req.params.num_commande + "%' ";

                if(req.params.date_min != "none" && req.params.date_max != "none") {
                  if (req.params.num_invoice == "none" && req.params.num_commande == "none")
                       var query = query + "WHERE COMMANDE_DEPOSITED_DATE BETWEEN " + mysql.escape(req.params.date_min) + " AND " + mysql.escape(req.params.date_max) + " ";
                  else
                       var query = query + "AND COMMANDE_DEPOSITED_DATE BETWEEN " + mysql.escape(req.params.date_min) + " AND " + mysql.escape(req.params.date_max) + " ";
                }
                query = query + "LIMIT " + req.params.min + "," + max;
                var table = ["NUM_FACTURE", "NUM_COMMANDE", "COMMANDE_DEPOSITED_DATE", "accelya.vue_juju"];
                query = mysql.format(query, table);
                connection.query(query, function(err, rows) {
                    if (err) {
                        res.status(400).send("bad realm !");
                    } else {
                        res.json(rows);
                    }
                })
              }
          })
      router.route('/downloadPdf/:invoice/:commande/:type')
          .get (function(req, res) {
              var query = "SELECT ?? AS pdf FROM ?? WHERE ?? = ? AND ?? = ?";
              var table = [req.params.type, 'accelya.vue_juju', 'NUM_FACTURE', req.params.invoice, 'NUM_COMMANDE', req.params.commande];
              query     = mysql.format(query, table);
              connection.query(query, function(err, rows) {
                if (err) {
                      res.status(400).send('bad realm');
                  } else {
                      if (rows[0].pdf) {
                        res.send(new Buffer(rows[0].pdf, 'binary'));
                      } else {
                        res.status(404).send('not found !');
                    }
                  }
              })
          })
      router.route('/downloadXml/:invoice/:commande/:type')
          .get (function(req, res) {
              var query = "SELECT ?? as xml from ?? WHERE ?? = ? AND ?? = ?";
              var table = [req.params.type, 'accelya.vue_juju', 'NUM_FACTURE', req.params.invoice, 'NUM_COMMANDE', req.params.commande];
              query     = mysql.format(query, table);
              connection.query(query, function(err, rows) {
                  if (err) {
                      res.status(400).send('bad Realm !');
                  } else {
                      if (rows[0].xml) {
                        result = new Buffer(rows[0].xml).toString('base64');
                        res.json(result);
                      } else {
                        res.status(404).send("Not found");
                      }
                  }
              })
          })
      router.route('/insermPDF/:type/:num_invoice/:amount_min/:amount_max/:min/:max/:clientName/:date_min/:date_max')
          .get (function (req, res) {
                var query = "SELECT ??, ??, ??, ??, ??, ??, ?? FROM ?? ";
      	        var table   = ["NUM_INVOICE", "CMD_CLIENT_NOM_USUEL", "PRINTED_DATE", "ACCOUNT_NUMBER", "INVOICE_TYPE", "TRAVELLER", "TOTAL_AMOUNT_TTC", "accelya.vue_inserm"];
                if (req.params.type != "none") {
                    var query = query + " WHERE INVOICE_TYPE = ? ";
            		    // table.push("FAC_TYPE");
            		    table.push(req.params.type);
                }
                if (req.params.num_invoice != "none") {
                		if (req.params.type == "none") {
                		    var query = query + "WHERE NUM_INVOICE LIKE '%" + req.params.num_invoice + "%' ";
                		    table.push(req.params.num_invoice);

                		} else {
                        var query = query + "AND NUM_INVOICE LIKE '%" + req.params.num_invoice + "%' ";
                		    table.push(req.params.num_invoice);
                		}
                }
                if (req.params.clientName != "none") {
                    if (req.params.type == "none" && req.params.num_invoice == "none") {
                      var query = query + "WHERE TRAVELLER LIKE '%" + req.params.clientName + "%' ";
                      // table.push(req.params.clientName)
                    } else {
                        var query = query + "AND TRAVELLER LIKE '%" + req.params.clientName + "%' ";
                    }
                }
                if(req.params.date_min != "none" && req.params.date_max != "none") {
                    if (req.params.type == "none" && req.params.num_invoice == "none" && req.params.clientName == "none") {
                        var query = query + "WHERE PRINTED_DATE BETWEEN " + mysql.escape(req.params.date_min) + " AND " + mysql.escape(req.params.date_max) + " ";
                    } else {
                        var query = query + "AND PRINTED_DATE BETWEEN " + mysql.escape(req.params.date_min) + " AND " + mysql.escape(req.params.date_max) + " ";
                    }
                }
                var query = query + " ORDER BY PRINTED_DATE DESC LIMIT " + req.params.min + ',' + req.params.max;;
    	          // table.push("NUM_INVOICE");
                query = mysql.format(query, table);
    	          connection.query(query, function(err, rows) {
                		if (err) {
                        res.status(400).send("Unable to execute request from search");
                		} else {
                		    res.json(rows);
                		}
          	     })
              })
}

// router.route('/pdfSearchFilter/:type/:num_invoice/:amount_min/:amount_max/:min/:max/:clientName/:date_min/:date_max/:num_commande')
//     .get (function (req, res) {
//           var query = "SELECT ??, ??, ??, ??, ??, ??, ??, ??, SUM(??) AS TOTAL_AMOUNT, ?? FROM ?? ";
// 	        var table   = ["SUPPLIER", "TYPE", "ACCOUNT_NUMBER", "LINE_DESCRIPTION", "TRAVELLER", "INVOICE_TYPE", "DATE_FROM", "ZP10", "AMOUNT", "NUM_INVOICE", "accelya.accelya_view_all"];
//           if (req.params.type != "none") {
//               var query = query + " WHERE INVOICE_TYPE = ? ";
//       		    // table.push("FAC_TYPE");
//       		    table.push(req.params.type);
//           }
//           if (req.params.num_invoice != "none") {
//           		if (req.params.type == "none") {
//           		    var query = query + "WHERE NUM_INVOICE LIKE '%" + req.params.num_invoice + "%' ";
//           		    table.push(req.params.num_invoice);
//
//           		} else {
//                   var query = query + "AND NUM_INVOICE LIKE '%" + req.params.num_invoice + "%' ";
//           		    table.push(req.params.num_invoice);
//           		}
//           }
//           if (req.params.clientName != "none") {
//               if (req.params.type == "none" && req.params.num_invoice == "none") {
//                 var query = query + "WHERE TRAVELLER LIKE '%" + req.params.clientName + "%' ";
//                 // table.push(req.params.clientName)
//               } else {
//                   var query = query + "AND TRAVELLER LIKE '%" + req.params.clientName + "%' ";
//               }
//           }
//           if(req.params.date_min != "none" && req.params.date_max != "none") {
//               if (req.params.type == "none" && req.params.num_invoice == "none" && req.params.clientName == "none") {
//                   var query = query + "WHERE DEPARTURE_DATE BETWEEN " + mysql.escape(req.params.date_min) + " AND " + mysql.escape(req.params.date_max) + " ";
//               } else {
//                   var query = query + "AND DEPARTURE_DATE BETWEEN " + mysql.escape(req.params.date_min) + " AND " + mysql.escape(req.params.date_max) + " ";
//               }
//           }
//           if (req.params.num_commande != "none") {
//               if (req.params.type == "none" && req.params.num_invoice == "none" && req.params.clientName == "none" && req.params.date_min == "none" && req.params.date_max == "none") {
//                   var query = query + "WHERE ZP10 LIKE '%" + req.params.num_commande + "%' ";
//               } else {
//                   var query = query + "AND ZP10 LIKE '%" + req.params.num_commande + "%' ";
//               }
//           }
//           var query = query + "GROUP BY NUM_INVOICE HAVING TOTAL_AMOUNT BETWEEN " + req.params.amount_min + " AND " + req.params.amount_max + " LIMIT " + req.params.min + ',' + req.params.max;;
//           query = mysql.format(query, table);
//           connection.query(query, function(err, rows) {
//           		if (err) {
//                   res.status(400).send("Unable to execute request from search");
//           		} else {
//           		    res.json(rows);
//           		}
//     	     })
//         })
