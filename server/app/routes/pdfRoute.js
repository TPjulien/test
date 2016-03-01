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
                var query = "SELECT ??, ??, ??, ??, ?? FROM ?? WHERE ?? LIKE '%" + invoice + "%' LIMIT " + min + ',' + max;
                var table = ['SUPPLIER', 'FAC_TYPE', 'CREATION_DATE', 'AMOUNT', 'NUM_INVOICE', 'accelya.accelya_view_all', "NUM_INVOICE"];
                query = mysql.format(query, table);
                connection.query(query, function(err, rows) {
                    if (err) {
                        res.json({ mesage: 'error' });
                    } else {
                        res.json(rows);
                    }
                })
              }
          });
}
