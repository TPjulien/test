var mysql = require('mysql');

// nouvelle fonction log
module.exports = function(router, connection) {
    router.route('/log')
        .post(function(req, res) {
	    console.log(req.body);
            var date     = new Date();
            var query    = "INSERT INTO ?? \
                            (??,??,??,??,??,??,??,??,??,??,??,??) \
                            VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
            var table    = ['tp_control_logs.events',
                            'ip', 'country_code', 'country_name', 'region_name', 'zip_code', 'time_zone', 'lattitude', 'longitude', 'action', 'user_id', 'username', 'event_datetime',
                            req.body.ip, req.body.country_code, req.body.country_name, req.body.region_name, req.body.zip_code, req.body.time_zone, req.body.lattitude.toString(), req.body.longitude.toString(), req.body.action, req.body.user_id, req.body.username, date];
            query = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if(err)
                    res.status(400).send(err);
                else
                    res.status(200).send("Ok");
            });
        })
}
