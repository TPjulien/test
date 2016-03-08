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
                    // res.json(rows);
                }
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
      router.route('/pdfSearchFilter/:type/:num_invoice/:amount_min/:amount_max/:min/:max/:clientName/:date_min/:date_max')
      .get (function (req, res) {
            var query = "SELECT ??, ??, ??, ??, ??, ??, ??, SUM(??) AS TOTAL_AMOUNT, ?? FROM ?? ";
  	        var table   = ["SUPPLIER", "TYPE", "ACCOUNT_NUMBER", "LINE_DESCRIPTION", "TRAVELLER", "FAC_TYPE", "DEPARTURE_DATE", "AMOUNT", "NUM_INVOICE", "accelya.accelya_view_all"];
            if (req.params.type != "none") {
                var query = query + " WHERE FAC_TYPE = ? ";
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
                if (req.params.type == "none") {
                  var query = query + "WHERE TRAVELLER LIKE '%" + req.params.clientName + "%' ";
                  // table.push(req.params.clientName)
                } else if(req.params.num_invoice != "none") {
                    var query = query + "AND TRAVELLER LIKE '%" + req.params.clientName + "%' ";
                } else {
                    var query = query + "AND TRAVELLER LIKE '%" + req.params.clientName + "%' ";
                }
            }
            if(req.params.date_min != "none" && req.params.date_max != "none") {
                if (req.params.type == "none" && req.params.num_invoice == "none" && req.params.clientName == "none") {
                    var query = query + "WHERE DEPARTURE_DATE BETWEEN ? AND ? ";
                    table.push(req.params.date_min);
                    table.push(req.params.date_max);
                } else {
                    var query = query + "AND DEPARTURE_DATE BETWEEN ? AND ? ";
                    table.push(req.params.date_min);
                    table.push(req.params.date_max);
                }
            }
            var query = query + "GROUP BY NUM_INVOICE HAVING TOTAL_AMOUNT BETWEEN " + req.params.amount_min + " AND " + req.params.amount_max + " LIMIT " + req.params.min + ',' + req.params.max;;
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
