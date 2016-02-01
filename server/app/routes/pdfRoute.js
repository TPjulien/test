var mysql = require('mysql');
var http_post = require('http-post');
var request   = require('request');

module.exports = function(router, connection) {

    // get blob pdf
    router.route('/pdfUser')
        .get (function(req, res) {
            var query = "SELECT * from ??";
            var table = ['tpo.blob'];
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
