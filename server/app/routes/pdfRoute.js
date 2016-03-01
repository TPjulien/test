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
      router.route('/pdfSearchFilter/:type/:num_invoice/:min/:max')
        .get (function (req, res) {
            var query = "SELECT ??, ??, ??, SUM(??) AS TOTAL_AMOUNT, ?? FROM ?? ";
  	        var table   = ["SUPPLIER", "FAC_TYPE", "CREATION_DATE", "AMOUNT", "NUM_INVOICE", "accelya.accelya_view_all"];
            if (req.params.type != "none") {
                var query = query + " WHERE ?? = ? ";
        		    table.push("FAC_TYPE");
        		    table.push(req.params.type);
            }
            if (req.params.num_invoice != "none") {
            		if (req.params.type == "none") {
            		    var query = query + "WHERE ?? =? ";
            		    table.push("NUM_INVOICE");
            		    table.push(req.params.num_invoice);

            		} else {
                                var query = query + "AND ?? = ? ";
            		    table.push("NUM_INVOICE");
            		    table.push(req.params.num_invoice);
            		}
            }
            var query = query + "GROUP BY ?? LIMIT " + req.params.min + ',' + req.params.max;
	          table.push("NUM_INVOICE");
            query = mysql.format(query, table);
	          connection.query(query, function(err, rows) {
            		if (err) {
            		    res.json({ 'message': 'error'});
            		} else {
            		    res.json(rows);
            		}
      	     })
          })
}
