var mysql = require('mysql');
var jwt   = require('jsonwebtoken');

// fonction pour le login généralisé

module.exports = {
    generate_token : function (column, result_column, result_site_id, can_logout, is_saml, req, res, connection) {
	var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ? ORDER BY ?? LIMIT 1"
	var table = ['profils.view_info_userConnected', column, result_column, 'SITE_ID', result_site_id, 'Role_ordre'];
	query     = mysql.format(query, table);
	connection.query(query, function(err, info_result) {
            if (err) {
		res.status(400).send(err);
            } else if (info_result.length == 0) {
		res.status(404).send("Not found");
            } else {
		var preToken = [{
		    "site_id":              info_result[0].SITE_ID,
		    "UID":                  info_result[0].UID,
		    "DEPOSITED_DATE":       info_result[0].DEPOSITED_DATE,
		    "home_community":       info_result[0].HomeCommunity,
		    "username":             info_result[0].Login,
		    "company":              info_result[0].SITE_LIBELLE,
		    "firstname":            info_result[0].Customer_GivenName,
		    "lastname":             info_result[0].Customer_surName,
		    "user_auth":            info_result[0].Role,
		    "can_logout":           can_logout,
		    "is_saml":              is_saml
		}];
		var token = jwt.sign(preToken, 'travelSecret', {
		    expiresIn: 7200
		});
		res.json({ 'token': token });
            }
	})
    }
}
