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

      // on recupere le type de bullet qu'on peut avoir
      router.route('/getBulletFilter')
          .post (function(req, res) {
              var table = req.body.schema + '.' + req.body.table
              var query_bullet = "SELECT DISTINCT(??) FROM ??";
              var table_bullet = [req.body.column_name, table];
              query_bullet = mysql.format(query_bullet, table_bullet);
              connection.query(query_bullet, function(err, result_bullet) {
                  if (err)
                      res.status(400).send(err);
                  else
                      res.json(result_bullet);
              })
          })
      // on recupere le filtre séparément
      router.route('/getFilterDatatable/:embed_id')
          .get (function(req, res) {
            var query_filter = "SELECT ??,??,??,?? \
                                      FROM ?? \
                                      WHERE ?? = ?";
            var table_filter = ["has_date_filter","has_search_filter","has_bullet_filter", "has_amount_filter", "tp_control.Datatable_WIP",
                                "EMBED_ID", req.params.embed_id];
            query_filter = mysql.format(query_filter, table_filter);
            connection.query(query_filter, function(err, result_filter) {
                if (err)
                    res.status(400).send(err);
                else {
                    // deuxieme requete pour recuperer les colones utilisées
                    var query_filter_column = "SELECT ?? FROM ?? WHERE ?? = ? AND pdf_display IS NULL";
                    var table_filter_column = ["column", "tp_control.Datatable_WIP", "EMBED_ID", req.params.embed_id];
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
              var query = "SELECT * FROM ?? WHERE ?? = ?";
              var table = ["tp_control.Datatable_WIP", "EMBED_ID", pre_data.EMBED_ID];
              query = mysql.format(query, table);
              connection.query(query, function(err, result_datatable) {
                if (err)
                    res.status(400).send(err);
                else {
                    // on fait les traitement
                    var query_datatable = 'SELECT `';
                    var table_datatable = [];
                    query_datatable += result_datatable[0].column;
                    for (var i = 1; i < result_datatable.length; i++) {
                        query_datatable += '`, `' + result_datatable[i].column;
                    }
                    query_datatable += '`';
                    // deuxieme étape de la query builder
                    query_datatable += ' FROM ' + result_datatable[0].schema + '.' + result_datatable[0].table;
                    if (filters.length != 0) {
                        for (name in filters) {
                            if (name == 0) {
                                if (filters[name]['value'].length == 2)
                                    query_datatable += ' WHERE `' + filters[name]['column_name'] + "` BETWEEN '" + filters[name]['value'][0] + "' AND '" + filters[name]['value'][1] + "' ";
                                else
                                    query_datatable += ' WHERE `' + filters[name]['column_name'] + "` LIKE '%" + filters[name]['value'] + "%' ";
                            } else {
                                if (filters[name]['value'].length == 2)
                                    query_datatable += ' AND `' + filters[name]['column_name'] + "` BETWEEN '" + filters[name]['value'][0] + "' AND '" + filters[name]['value'][1] + "' ";
                                else
                                    query_datatable += ' AND `' + filters[name]['column_name'] + "` LIKE '%" + filters[name]['value'] + "%' ";
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
