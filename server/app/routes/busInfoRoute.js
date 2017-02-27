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
			    console.log("le mail", user_mail);
			    var _resultObject = {
				"site_id" : site_id,
				"uid"     : uid,
				"email"   : user_mail[0].EMAIL,
				"first_name": _result[0].FIRST_NAME,
				"last_name": _result[0].LAST_NAME
			    };
			    console.log("le resultat", _result);
                            res.json(_resultObject);
                        }
                    })
                }
            })
        })
    // router.route('/checkProfil')
    //     .post(function (req, res) {

    //     })
}
