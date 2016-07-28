var mysql = require('mysql');
var geoip = require('geoip-lite');

// nouvelle fonction log
module.exports = function(router, connection) {
    router.route('/log')
        .post(function(req, res) {
            var getIp    = req.connection.remoteAddress;
            var dataInfo = geoip.lookup(getIp);
            var date     = new Date();
            var query    = "INSERT INTO ?? \
                            (??,??,??,??,??,??,??,??,??) \
                            VALUES (?,?,?,?,?,?,?,?,?)"
            var table    = ['tp_control_logs.events',
                            'ip', 'ip_country', 'ip_longitude', 'ip_latitude', 'ip_region', 'action', 'user_id', 'username', 'event_datetime',
                            getIp, dataInfo.country, dataInfo.ll[1], dataInfo.ll[0], dataInfo.region, req.body.action, req.body.user_id, req.body.username, req.body.event_datetime];
            query = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if(err)
                    res.status(400).send(err);
                else
                    res.status(200).send();
            });
        })
}
