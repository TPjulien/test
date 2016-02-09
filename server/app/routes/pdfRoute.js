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
      router.route('/getPDF')
          .get (function(req, res) {
              var query = "select ?? from ?? LIMIT 50";
              var table = ['NUM_INVOICE', 'accelya.pdf'];
              query     = mysql.format(query, table);
              connection.query(query, function(err, rows) {
                  if (err) {
                      res.json({ message: 'error'})
                  } else {
                      res.json(rows);
                  }
              })
          });
}
