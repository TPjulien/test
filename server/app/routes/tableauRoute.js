var http_post = require('http-post');
var request = require('request');

module.exports = function (router, connection, mysql, client) {
    router.route('/getTableau')
	.post(function (req, res) {
	    var query = "SELECT * FROM ?? WHERE ?? = ?";
	    var table = ['click_dash_base.click_Tableau',
			 'EMBED_ID', req.body.embed_id];
	    query = mysql.format(query, table);
	    connection.query(query, function (err, result_datatable) {
		if (err) {
		    res.status(400).send(err);
		} else if (result_datatable.length == 0) {
		    res.status(404).send('La ressource demandé est introuvable.');
		} else {
		    var user_site = "";
		    if (result_datatable[0].tableau_site != "Default") {
			user_site = result_datatable[0].tableau_site;
		    }
		    var username = "";
		    // condition si jamais ce n'est pas un customer
		    if (result_datatable[0].tableau_site == "Customer") {
			username = req.body.get_user_name
		    } else {
			username = result_datatable[0].tableau_user_id;
		    }
		    var options = {
			url: 'https://' + result_datatable[0].tableau_server_url + '/trusted',
			form: {
			    username: username,
			    target_site: user_site
			}
		    }
		    // get token for each tableau in row
		    request.post(options, function (err, resultat, body) {
			if (body != '' || body != undefined || body != null) {
			    var resultObject = {
				"SITE_ID": result_datatable[0].SITE_ID,
				"VIEW_ID": result_datatable[0].VIEW_ID,
				"EMBED_ID": result_datatable[0].EMBED_ID,
				"tableau_site": result_datatable[0].tableau_site,
				"tableau_view": result_datatable[0].tableau_view,
				"tableau_user_id": result_datatable[0].tableau_user_id,
				"tableau_server_url": result_datatable[0].tableau_server_url,
				"token": body
			    };
						    res.json(resultObject);
			} else {
			    res.status(404).send('élement introuvable !');
			}
		    })
		}
	    })
	    
	})
    router.route('/tokenExchange')
	.post(function (req, res) {
	    _username = req.body.user_name;
	    if (req.body.tableau_site != "Default") {
		user_site = req.body.tableau_site;
	    }
	    if (_username) {
		if (_username.indexOf("R4XB") != -1) {
		    _username = "Julien";
		} else {
		    _username = req.body.user_name;
		}
	    }
	    
	    var options = {
		url: 'https://data.travelplanet.fr/trusted',
		form: {
		    username: _username,
		    target_site: user_site
		}
	    }
	    request.post(options, function (err, result, body) {
		if (err) {
		    res.status(400).send(err);
		} else {
		    if (body != '' || body != undefined || body != null) {
			var resultObject = { "token": body }
			if (body != "-1") {
			    res.json(resultObject);
			} else {
			    var query = "SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ? GROUP BY ??";
			    var table = ["ROLE", "profils.view_0_role", "SITE_ID", req.body.site_id + req.body.site_id, "UID", req.body.uid, "ROLE"];
			    query = mysql.format(query, table);
			    connection.query(query, function(_err, _result) {
				if (_err) {
				    res.status(400).send(_err);
				} else {
				    query = "SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ? LIMIT 1";
				    table = ["PREF_LANGUAGE", "profils.view_0_main", "SITE_ID", req.body.site_id + req.body.site_id, "UID", req.body.uid];
				    query = mysql.format(query, table);
				    connection.query(query, function(_err, _result_language) {
					if (_err) {
					    res.status(400).send(_err);
					} else {
					    var language = _result_language[0].PREF_LANGUAGE;
					    var array_roles = [];
					    var object = {
						"Administrator": { "type": "A", "number": 1 },
						"Custom Administrator": { "type": "A", "number": 1 },
						"Super Travel Approver": { "type": "P", "number": 2 },
						"Super Travel Arranger": { "type": "R", "number": 2 },
						"Travel Approver": { "type": "P", "number": 2 },
						"Travel Arranger": { "type": "R", "number": 2 },
						"Traveler": { "type": "T", "number": 3 },
						"Profile Manager": { "type": "M", "number": 4 }
					    };
					    for (var int_i in _result) {
						var object_temp = {
						    "name":   _result[int_i].ROLE,
						    "type":   object[_result[int_i].ROLE]['type'],
						    "number": object[_result[int_i].ROLE]['number']
						};
						array_roles.push(object_temp);
					    }
					    
					    var sortable = array_roles.sort(function (a, b) {
						return a.number - b.number;
					    })
					    
					    var minimum_roles = sortable[0].number;
					    var letter_array = [];
					    for (var int_x in sortable) {
						if (minimum_roles == sortable[int_x].number) {
						    letter_array.push(sortable[int_x].type);
						}
					    }
					    var filtered_roles = letter_array.filter(function (item, pos) {
						return letter_array.indexOf(item) == pos;
					    })
					    var sorted_roles = filtered_roles.sort();
					    if (sorted_roles.length != 2) {
						sorted_roles = sorted_roles[0] + '_';
					    } else {
						sorted_roles = sorted_roles.join('');
					    }
					    console.log(req.body.site_id + language + sorted_roles + req.body.uid);
					    var options = {
						url: 'https://data.travelplanet.fr/trusted',
						form: {
						    username: req.body.site_id + language + sorted_roles + req.body.uid,
						    target_site: user_site
						}
					    }
					    request.post(options, function (err, result, body) {
						if (err) {
						    res.status(400).send(err);
						} else {
						    if (body != '' || body != undefined || body != null) {
							var resultObject = { "token": body }
							res.json(resultObject);
						    }
						}
					    })
					}
				    })
				}
			    })
			}
		    }
		}
	    })
	    
	})
}
