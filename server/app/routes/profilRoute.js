var mysql = require('mysql');

module.exports = function(router, connection) {
    router.route('/profils/:id')
        .get(function(req, res) {
            var query_one    = "SELECT \
                               ??, ??, ??, \
                               ??, ??, ??, ??, ??, ??, \
                               ??, ??, ??, ??, ?? \
                               FROM ?? em \
                               LEFT JOIN ?? cu \
                                  ON ?? = ?? \
                                  AND ?? = ?? \
                               LEFT JOIN ?? ph \
                                  ON ?? = ?? \
                                  AND ?? = ?? \
                               WHERE ?? = ?";
            var table_one    = ["em.site_id",         "em.uid",             "em.Email",
                                "cu.Customer_Gender", "Customer_BirthDate", "Customer_surName",    "Customer_NameTitle",   "Customer_MiddleName", "Customer_GivenName",
                                "ph.PhoneUseType",    "ph.PhoneTechType",   "ph.PhoneCountryCode", "ph.PhoneAreaCityCode", "ph.PhoneNumber",
                                "profils.email",
                                "profils.customer",
                                    "em.site_id", "cu.site_id",
                                    "em.uid",     "cu.uid",
                                "profils.phone",
                                    "em.site_id", "ph.site_id",
                                    "em.uid",     "ph.uid",
                                "em.uid", req.params.id];
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
    router.route('/community')
        .get(function(req, res) {
            var query_one = "SELECT DISTINCT ?? FROM ?? WHERE ?? = ?";
            var table_one = ["HomeCommunity", "view_tpa_extensions_libelle", "SITE_ID", "Q1CNQ1CN"];
            query_one     = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
}
