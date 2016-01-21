var mysql = require('mysql');

module.exports = function(router, connection) {
    router.route('/route')
        .post (function(req, res) {
            var query = "SELECT * FROM ?? WHERE ?? = ?";
            var table = ['template_path', 'user', req.body.user];
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
}
