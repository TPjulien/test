var http_post = require('http-post');
var request   = require('request');

module.exports = function(router, connection, mysql, client) {
    router.route('/getTableau')
       .post(function(req, res) {
            var query    = "SELECT * FROM ?? \
                              WHERE ?? = ?";
            var table    = ['click_dash_base.click_Tableau',
                            'EMBED_ID', req.body.embed_id];
            query = mysql.format(query, table);
            connection.query(query, function(err, result_datatable) {
                if(err) {
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
                      form : {
                        username    : username,
                        target_site : user_site
                      }
                  }
                  // get token for each tableau in row
                  request.post(options, function(err, resultat, body) {
                    if (body != '' || body != undefined || body != null) {
                        var resultObject = { "SITE_ID"            : result_datatable[0].SITE_ID,
                                             "VIEW_ID"            : result_datatable[0].VIEW_ID,
                                             "EMBED_ID"           : result_datatable[0].EMBED_ID,
                                             "tableau_site"       : result_datatable[0].tableau_site,
                                             "tableau_view"       : result_datatable[0].tableau_view,
                                             "tableau_user_id"    : result_datatable[0].tableau_user_id,
                                             "tableau_server_url" : result_datatable[0].tableau_server_url,
                                             "token"              : body
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
        .post(function(req, res) {
            user_site = "";
            _username = req.body.user_name;
	    if (req.body.tableau_site != "Default") {
                user_site = req.body.tableau_site;
            }
	    var query = "SELECT txt_value FROM profils.user_profile WHERE user_id=? AND site_id=? AND key=?";
	    var table = [req.body.uid, req.body.site_id, 'main'];
	    var object = {
		"Administrator"         : { "type" : "A", "number" : 1 },
		"Custom Administrator"  : { "type" : "A", "number" : 1 },
		"Super Travel Approver" : { "type" : "P", "number" : 2 },
		"Super Travel Arranger" : { "type" : "R", "number" : 2 },
		"Travel Approver"       : { "type" : "P", "number" : 2 },
		"Travel Arranger"       : { "type" : "R", "number" : 2 },
		"Traveler"              : { "type" : "T", "number" : 3 },
		"Profile Manager":        { "type" : "M", "number" : 4 }
	    };
	    client.execute(query, table, function(_err, _result) {
		if (_err) {
		    console.log(_err);
		} else {
		    var array_roles = [];
		    var array_number_roles = [];
		    var body_parsed = (JSON.parse(_result.rows[0].txt_value));
		    for (var int_i in body_parsed.role) {
			var objectTemp = {
			    "name"   : body_parsed.role[int_i].role,
			    "type"   : object[body_parsed.role[int_i].role]['type'],
			    "number" : object[body_parsed.role[int_i].role]['number']
			};
			array_roles.push(objectTemp);
		    }
		    
		    var sortable = array_roles.sort(function(a,b) {
			return a.number - b.number;
		    })
		    // on prend le minimum du role vu qu'il à été sort
		    var minimum_roles = sortable[0].number;
		    // On fait une autre boucle et on push dedans les letres dispo et on supprime les duplqués 
		    var letter_array  = [];
		    for (var int_x in sortable) {
			if (minimum_roles == sortable[int_x].number) {
			    letter_array.push(sortable[int_x].type);
			}
		    }
		    var filtered_roles = letter_array.filter(function(item, pos) {
			return letter_array.indexOf(item) == pos;
		    })
		    var sorted_roles = filtered_roles.sort();
		    if (sorted_roles.length != 2){
			sorted_roles = sorted_roles[0] + '_';
		    } else {
			sorted_roles = sorted_roles.join('');
		    }
		    if (_username) {
			if (_username.indexOf("R4XB") != -1) {
			    _username = "Julien";
			} else {
			    _username = req.body.site_id + body_parsed.language + sorted_roles + req.body.uid;
			}
		    }
		    console.log("l'username", _username);
		    var options = {
			url : 'https://data.travelplanet.fr/trusted',
			form : {
			    username    : req.body.user_name,
			    target_site : user_site
			}
		    }
		    request.post(options, function(err, result, body) {
			if (err) {
			    res.status(400).send(err);
			} else {
			    if (body != '' || body != undefined || body != null) {
				var resultObject = { "token" : body }
				if ( body != "-1"){
				    res.json(resultObject);
				} else {
				    options.url.site.username = _username;
				    request.post(options, function(_err, _result, _body) {
					if (_body != '' || body != undefined || body != null) {
					    var _resultObject = { "token" : _body };
					    res.json(_resultObject);
					}
				    })
				}
			    }
			}
		    })
		}
	    })
        })
}
