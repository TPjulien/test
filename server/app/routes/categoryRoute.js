var mysql       = require('mysql');

module.exports = function(router, connection) {
    router.route('/getCategory/:user')
        .get(function(req, result) {
            var query = "SELECT * from ?? WHERE ?? = ?";
            var table = ['category', 'user', req.params.user];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error'})
                } else {
                    res.json(rows);
                }
            })
        })
}
