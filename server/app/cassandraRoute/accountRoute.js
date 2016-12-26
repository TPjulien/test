var builder    = require('../functions/builder.js');
var jwt        = require('jsonwebtoken');
var bitmask    = require('../functions/bitmask.js');

module.exports = function(router, client) {
  router.route('/login')
  .post(function(req, res) {
    var getRequest = builder.selectBuilder('table1', req.body.selected, req.body.parameters);
    client.execute(getRequest.query, getRequest.values, function(err, result) {
      if (err || result.rows.length == 0) {
        res.status(401).send("");
     } else {
       var team = [];
        var getResult = JSON.parse(result.rows[0].js_data);
        for (var key in getResult.associated_teams) {
          if(getResult.associated_teams.hasOwnProperty(key)) {
            team.push(getResult.associated_teams[key].team_name);
         }
        }
        if (req.body.password === getResult.password) {
          delete getResult['password'];
          delete getResult['associated_teams'];
          getResult.access_team = team;
          getResult.user        = result.rows[0].id;
          var token = jwt.sign(getResult, 'travelSecret', {
            expiresIn : 7200
          });
          res.status(200).send(token);
        } else {
          res.status(401).send("");
        }
      }
    })
  })

  // pour click à le bouger apres
  // menu v2
  router.route('/menu/:site_id')
  .post(function(req, res) {
    var roles       = req.body.roles;
    var site_id     = req.params.site_id;
    var query       = "SELECT * FROM click.table2 WHERE type=? AND key=? AND id1=?";
    var bitmasks    = [];
    var table       = [];
    client.execute(query, ['click', 'view', site_id], function(err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        query = "SELECT bitmasks, role_id FROM click.role WHERE site_id=?"
        client.execute(query, [site_id], function(err, resultTwo) {
         if (err) {
            res.status(400).send(err);
          } else {
            for (var row in resultTwo.rows) {
              if (roles.indexOf(resultTwo.rows[row].role_id) != -1) {
                var getLength = bitmasks.length;
                if (getLength == "0") {
                  bitmasks = resultTwo.rows[row].bitmasks;
                } else {
                  bitmasks = bitmask.compareListOr(bitmasks, resultTwo.rows[row].bitmasks);
                }
              }
            }
            var mapEmbed     = [];
            var embedBm      = [];
            var roleBitmasks = bitmasks;
            var js_datas     = [];
            var menuResult   = [];
            for (var data in result.rows) {
              temp = eval(result.rows[data].js_data);
              js_datas.push(temp[0]);
            }

            for (var key in js_datas) {
		if (js_datas[key].view_map) {
		    var getLength = js_datas[key].view_map.length
		    if (getLength != 0) {
			embedBm                       = js_datas[key].view_map;
			embedBm                       = bitmask.compare(roleBitmasks, embedBm);
			js_datas[key].view_embed_data = bitmask.decode(embedBm);
			delete js_datas[key]['list_embed'];
			delete js_datas[key]['map_embed'];
			menuResult.push(js_datas[key]);
		    }
		}
            }
            finalmenu = []
            // vérification de l'embed
            for (var menu in menuResult) {
                if (menuResult[menu].view_embed_data.length != 0) {
                    finalmenu.push(menuResult[menu]);
		}
            }
	    //console.log(finalmenu);
	    // On ajoute la requete pour les agg
	    aggRequest = "SELECT js_data FROM click.table2 WHERE type='click' AND key='agg' AND id1=?";
	    client.execute(aggRequest, [req.params.site_id], function(err, agg) {
		if (err) {
		    res.status(400).send(err);
		} else {
		    views_alone = [];
		    temp = [];
		    for (var aggregation in agg.rows) {
			transition = eval(agg.rows[aggregation].js_data);
			temp.push(transition[0]);
			transition = [];
		    }
		    getgetget = [];

		    for (var getAgg in temp) {
			if (temp[getAgg].list_view.length != 0) {
			    for(var listView in temp[getAgg].list_view) {
				for(var i in finalmenu) {
				    if (temp[getAgg].list_view[listView] == finalmenu[i].view_id) {
					var tempMenu = [];
					delete finalmenu[i]['view_map'];
					getgetget.push(finalmenu[i]);
				    }
				}
			    }
			    temp[getAgg].view_list = {};
			    temp[getAgg].view_list = getgetget;
			    getgetget = [];
			    delete temp[getAgg]['list_view'];
			}
		    }
		    //console.log(temp);
		    temp_view_alone = []
		    view_id_temp    = []
		    for (var key in temp) {
			if (temp[key].view_list){
			    if (temp[key].view_list) {
				for (var listID in temp[key].view_list) {
				    if (view_id_temp.indexOf(temp[key].view_list[listID].view_id) == -1) {
					view_id_temp.push(temp[key].view_list[listID].view_id)
				    }
				}

			    }
			}
		    }
		    for (var menu in finalmenu) {
			if (view_id_temp.indexOf(finalmenu[menu].view_id) == -1) {
			    temp_view_alone.push({"groupe_libelle"  : finalmenu[menu].view_label,
						  "groupe_position" : finalmenu[menu].view_position,
						  "groupe_color"    : finalmenu[menu].view_color,
						  "groupe_logo"     : finalmenu[menu].view_logo_base_64,
						  "view_embed_data" : finalmenu[menu].view_embed_data
						 })
			}
		    }
		    tempFinal = temp.concat(temp_view_alone);
		    res.send(tempFinal);
		}
	    })
          }
        })
      }
    })
  })
}
