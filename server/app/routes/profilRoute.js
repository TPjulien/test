var mysql = require('mysql');

module.exports = function(router, connection) {
    router.route('/profils/:id')
        .get(function(req, res) {
            var query_one = "SELECT \
                             ??, ??, ??, ??, ??, \
                             ??, ??, ?? \
                             FROM ?? ai \
                             LEFT JOIN ?? ap \
                                 ON  ?? = ?? \
                                 AND ?? = ?? \
                                 AND ?? = ?? \
                            WHERE ?? = ?";
            var table_one = ["ai.site_id", "ai.uid" , "ai.deposited_date", "ai.ProgramCode", "ai.MembershipId",
                             "ap.AirPrefLangID", "ap.AirPassengerType", "ap.AirTicketDistribPref",
                             "profils.air_loyalty",
                             "profils.air_pref",
                             "ai.SITE_ID", "ap.SITE_ID",
                             "ai.UID", "ap.UID",
                             "ai.DEPOSITED_DATE", "ap.DEPOSITED_DATE",
                             "ai.site_id", req.params.id];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    // route pour lister toutes les countries pour le phone
    router.route('/getCountry')
        .get(function(req, res) {
            var query_one = "SELECT ?? FROM ??";
            var table_one = ["nicename", "country"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    router.route('/phoneCode/:country')
        .get(function(req, res) {
            var query_one = "SELECT ?? FROM ?? WHERE ?? = ?";
            var table_one = ["phonecode", "country", "nicename", req.params.country];
            query_one     = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
}
