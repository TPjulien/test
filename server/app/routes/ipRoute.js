var mysql = require('mysql');
var geoip = require('geoip-lite');

module.exports = function(router, connection) {
    router.route('/rules/ip')
        .post(function(req, res) {
            var getIp    = req.connection.remoteAddress;
            var dataInfo = geoip.lookup(getIp);
            var query    = "INSERT INTO ?? \
                            (??,??,??,??,??,??) \
                            VALUES (?,?,?,?,?,?)"
            var table    = ['ip_info',
                            'ip', 'ip_country', 'ip_longitude', 'ip_latitude', 'ip_region', 'action',
                            getIp, dataInfo.country, dataInfo.ll[1], dataInfo.ll[0], dataInfo.region, req.body.action];
            query = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if(err)
                    res.status(400).send("Bad realm !");
                else
                    res.status(200).send("Ok !");
            });
        })
}
