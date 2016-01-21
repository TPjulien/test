var mysql = require('mysql');

module.exports = function(router, connection) {
    router.route('/view/:user')
        .get (function(req, res) {
            var query = "SELECT * FROM ?? WHERE ?? = ?";
            var table = ['template_path', 'user', req.params.user];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error !'})
                    // callback(err, 404);
                } else {
                    res.json(rows);
                    // callback(null, rows);
                }
            })
            // res.json({ message: "hello ceci est une route avec un token obligatoire !"})
        })
    // get only one
    router.route('/templateUSer/:user/:id')
        .get (function(req, res) {
            var query = "SELECT * from ?? WHERE ?? = ? AND ?? =?";
            var table = ['template_path', 'user', req.params.user, 'id', req.params.id];
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
