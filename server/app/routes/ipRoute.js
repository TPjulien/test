var mysql = require('mysql');
var geoip = require('geoip-lite');


module.exports = function(router, connection) {
    router.route('/rules/ip')
        .get (function(req, res) {
            var getIp = req.connection.remoteAddress;
            res.json({"ip" : getIp,
                      "dataInfo": geoip.lookup(getIp)
            });
            // var query = "SELECT * from ?? WHERE ?? = ? AND ?? = ?";
            // var table = ['rules_filter_info', 'client_id', req.params.client_id, 'user_id', req.params.user_id];
            // query     = mysql.format(query, table);
            // connection.query(query, function(err, rows) {
            //     console.log(rows);
            //     if (err) {
            //         res.status(400).send("Bad realm !");
            //     } else if (rows.lgenth == 0) {
            //         res.status(404).send("Not Found");
            //     } else {
            //         res.json(rows);
            //     }
            // })
        })
}
