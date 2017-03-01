var http = require('http');
var request = require('request');

module.exports = function (router, connection, mysql) {

    function returnOptions(query, database, decrypt_table) {
        var options = {
            url: 'http://api-interne.travelplanet.fr/api/ReadDatabase/selectMySQLPost',
            form: {
                sql: query,
                database: database,
                decrypt: decrypt_table
            }
        }
        return options;
    }
    // à changer
    router.route('/userMailInfo')
        .post(function (req, res) {
            var uid = req.body.uid;
            var site_id = req.body.site_id;
            var query = "SELECT ??,?? FROM ?? WHERE ?? = ? AND ?? = ?";
            var table = ["FIRST_NAME", "LAST_NAME", "profils.view_0_main", "SITE_ID", site_id, "UID", uid];
            query = mysql.format(query, table);
            connection.query(query, function (err, _result) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    query = "SELECT * FROM view_0_email WHERE SITE_ID ='" + site_id + "' AND UID ='" + uid + "' LIMIT 1";
                    request.post(returnOptions(query, 'profils', 'EMAIL'), function (err, result, body) {
                        if (err) {
                            res.status(400).send(err)
                        } else {
                            var user_mail = JSON.parse(body);
                            var _resultObject = {
                                "site_id": site_id,
                                "uid": uid,
                                "email": user_mail[0].EMAIL,
                                "first_name": _result[0].FIRST_NAME,
                                "last_name": _result[0].LAST_NAME
                            };
                            res.json(_resultObject);
                        }
                    })
                }
            })
        })
    router.route('/aetmRoles')
        .post(function (req, res) {
            var uid = req.body.uid;
            var site_id = req.body.site_id;
            var query = " SELECT ROLE FROM ?? WHERE ?? = ? AND ?? = ? GROUP BY ??";
            var table = ["profils.view_0_role", "SITE_ID", site_id, "UID", uid, "ROLE"];
            query = mysql.format(query, table);
            connection.query(query, function (_err, _roles) {
                if (_err) {
                    res.status(400).send(_err);
                } else {
                    res.send(_roles);
                }
            })
        })
    router.route('/checkUser/:site_id/:user')
        .get(function (req, res) {
            var query = "SELECT * FROM profils.view_0_bus_profil WHERE NAME LIKE '%" + req.params.user + "%'";
            query += " AND SITE_ID = '" + req.params.site_id + "'";
            request.post(returnOptions(query, 'profils', 'EMAIL'), function (_err, _result, _body) {
                if (_err) {
                    res.status(400).send(_err);
                } else {
                    var user_mail = JSON.parse(_body);
                    res.json(user_mail);
                }
            })
        })
}
