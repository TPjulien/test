var mysql = require('mysql');
var http_post = require('http-post');
var request   = require('request');

module.exports = function(router, connection) {

    router.route('/view/:user/:site')
        .get (function(req, res) {
            var completed_requests = 0;
	          var second_requests    = 0;
            var element            = {};
            var final_object       = [];
            var query = "SELECT * FROM ?? WHERE ?? = ?";
            var table = ['template_path', 'user', req.params.user];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error !'})
                } else {
          		  var token  = [];
          		  var info   = [];
          		  var length = [];
          		  var height = [];
          		  var width  = [];
          		  var name   = [];
                for (item in rows) {
                    request.post('http://data.travelplanet.fr/trusted', {form:{ username: req.params.user, target_site: req.params.site }}, function(err, resultat, body) {
            			  info.push(rows[completed_requests].path);
            			  token.push(body);
            			  length.push(rows[completed_requests].length);
            			  width.push(rows[completed_requests].width);
            			  height.push(rows[completed_requests].height);
            			  name.push(rows[completed_requests].name);
            			  completed_requests++;
            			  if (completed_requests == rows.length) {
            			      var afterResult = {};
            			      var object_parsed = [];
            			      for (getinfo in info) {
              				  element.info   = info[getinfo];
              				  element.token  = token[getinfo];
              				  element.length = length[getinfo];
              				  element.width  = width[getinfo];
              				  element.name   = name[getinfo];
              				  object_parsed.push(element);
              				  if(second_requests == (rows.length - 1)) {
              				      res.json({info: info, token: token, width: width, length:length, name: name, height: height});
              				  }
                        second_requests++;
              			    }
                      }
                    });
                }
              }
            })
        })

    router.route('/currentView/:user/:site/:customer/:view')
        .get (function(req, res) {
            var completed_requests = 0;
	          var second_requests    = 0;
            var element            = {};
            var final_object       = [];
            var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
            var table = ['tableau_embed_view_info', 'tableau_customer_id', req.params.customer, 'view_id', req.params.view];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.status(400).send("Bad realm !");
                } else if (rows.length == 0) {
                    res.status(404).sed("Not found !");
                } else {
                  var site_id                = [];
                  var view_id                = [];
                  var embed_id               = [];
                  var path_to_view           = [];
                  var tableau_user_id        = [];
                  var tableau_server_url     = [];
                  var token                  = [];
                  var tableau_customer_id    = [];
                  var embed_height           = [];
                  var embed_width            = [];
                  var embed_position         = [];
                  var embed_content_type     = [];
                  var embed_background_color = [];
                  for (item in rows) {
                      request.post('http://data.travelplanet.fr/trusted', {form:{ username: req.params.user, target_site: req.params.site }}, function(err, resultat, body) {
                      site_id.push(rows[completed_requests].site_id);
              			  view_id.push(rows[completed_requests].view_id);
                      embed_id.push(rows[completed_requests].embed_id);
                      path_to_view.push(rows[completed_requests].path_to_view);
                      tableau_user_id.push(rows[completed_requests].tableau_user_id);
                      tableau_server_url.push(rows[completed_requests].tableau_server_url);
                      token.push(body);
                      tableau_customer_id.push(rows[completed_requests].tableau_customer_id);
                      embed_height.push(rows[completed_requests].embed_height);
                      embed_width.push(rows[completed_requests].embed_width);
              			  embed_position.push(rows[completed_requests].embed_position);
                      embed_content_type.push(rows[completed_requests].embed_content_type);
                      embed_background_color.push(rows[completed_requests].embed_background_color);
              			  completed_requests++;
              			  if (completed_requests == rows.length) {
              			      var afterResult = {};
              			      var object_parsed = [];
              			      for (getinfo in path_to_view) {
                          element.site_id                = site_id[getinfo];
                          element.view_id                = view_id[getinfo];
                          element.embed_id               = embed_id[getinfo];
                          element.path_to_view           = path_to_view[getinfo];
                          element.tableau_user_id        = tableau_user_id[getinfo];
                          element.tableau_server_url     = tableau_server_url[getinfo];
                				  element.token                  = token[getinfo];
                          element.tableau_customer_id    = tableau_customer_id[getinfo];
                          element.embed_height           = embed_height[getinfo];
                          element.embed_width            = embed_width[getinfo];
                          element.embed_position         = embed_position[getinfo];
                          element.embed_content_type     = embed_content_type[getinfo];
                          element.embed_background_color = embed_background_color[getinfo];
                				  object_parsed.push(element);
                				  if(second_requests == (rows.length - 1)) {
                				      res.json({
                                  site_id:                site_id,
                                  view_id:                view_id,
                                  embed_id:               embed_id,
                                  path_to_view:           path_to_view,
                                  tableau_user_id:        tableau_user_id,
                                  tableau_server_url:     tableau_server_url,
                                  token:                  token,
                                  tableau_customer_id:    tableau_customer_id,
                                  embed_height:           embed_height,
                                  embed_width:            embed_width,
                                  embed_position:         embed_position,
                                  embed_content_type:     embed_content_type,
                                  embed_background_color: embed_background_color
                              });
                				  }
                          second_requests++;
                			    }
                        }
                      });
                  }
                }
              })
        })


    // get only one
    router.route('/templateUSer/:user/:id')
        .get (function(req, res) {
            var query = "SELECT * from ?? WHERE ?? = ? AND ?? =?";
            var table = ['template_path', 'user', req.params.user, 'id', req.params.id];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error'})
                } else {
                    res.json(rows);
                }
            })
        });
}
