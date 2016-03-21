var mysql = require('mysql');

module.exports = function(router, connection) {
    router.route('/rules/:client_id')
        .get (function(req, res) {
            var query = "SELECT * from ?? WHERE ?? = ?";
            var table = ['portail_tableau.view_rules_info', 'client_id', req.params.client_id];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
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
