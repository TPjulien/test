var mysql       = require('mysql');

module.exports = function(router, connection) {
    router.route('/getDimension/:user')
        .get(function(req, result) {
            var query = "SELECT * from ?? WHERE ?? = ?";
            var table = ['dimension', 'user', req.params.user];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error'})
                } else {
                    res.json(rows);
                }
            })
        })
    router.route('/getOneDimension/:user/:view')
        .get(function(req, res) {
            var query = "SELECT * from ?? WHERE ?? = ? AND ?? = ?";
            var table = ['dimension', 'user', req.params.user, 'name', req.params.view];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error'})
                } else {
                    res.json(rows);
                }
            });
        });
}
