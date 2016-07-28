var mysql = require('mysql');

module.exports = function(router, connection) {
    router.route('/profils/:id')
        .get(function(req, res) {
            var query_one    = "SELECT \
                               * \
                               FROM ?? \
                               WHERE ?? = ?";
            var table_one    = [
                                "profils.view_profil_lvl1",
                                "uid", req.params.id];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    router.route('/railClass')
        .get(function(req, res) {
            var query_one = "SELECT DISTINCT ?? FROM ?? WHERE ?? IS NOT NULL";
            var table_one = ["railClass", "profils.view_profil_lvl1","railClass"];
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
            var table_one = ["site_libelle", "profils.view_tpa_extensions_libelle", "SITE_ID", "Q1CNQ1CN"];
            query_one     = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
    router.route('/usersCommunity/:number_community')
        .get(function(req, res) {
            var query_one = "SELECT *  FROM ?? WHERE ?? = ? GROUP BY ??";
            var table_one = ["profils.customer", "SITE_ID", req.params.number_community, "Customer_surName"];
            query_one     = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows) {
                if (err)
                    res.status(400).send(err);
                else
                    res.json(rows);
            })
        })
}
