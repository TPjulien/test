var mysql = require('mysql');

module.exports = function(router, connection) {
    router.route('/rules/:client_id/:user_id')
        .get (function(req, res) {
            var query = "SELECT * from ?? WHERE ?? = ? AND ?? = ?";
            var table = ['rules_filter_info', 'client_id', req.params.client_id, 'user_id', req.params.user_id];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                console.log(rows);
                if (err) {
                    res.status(400).send("Bad realm !");
                } else if (rows.lgenth == 0) {
                    res.status(404).send("Not Found");
                } else {
                    res.json(rows);
                }
            })
        })
}