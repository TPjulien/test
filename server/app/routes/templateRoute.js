var http_post = require('http-post');
var request   = require('request');
var fs        = require('fs');

module.exports = function(router, connection, mysql) {
    // structure tableau v2
    // On utilise un post au lieu d'un GET
    router.route('/showEmbed')
        .post(function(req, res) {
            // la premiere étape consiste à verifier le role de l'utilisateur
            var user_role = req.body.user_role;
            var site_id   = req.body.site_id;
            var embed_id  = req.body.embed_id;
            // on prepare la premiere requete pour verifier
            var request_one = "SELECT ??, ?? FROM ?? WHERE ?? = ? AND ?? IN \
                                  (SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ?) AND ?? = ?";
            var table_one   = ["ROLE_ID",  "EMBED_ID", "click_dash_base.click_Embed_Role", "SITE_ID", site_id, "ROLE_ID",
                              "ROLE_ID", "click_dash_base.click_Role", "ROLE_LIBELLE", user_role, "SITE_ID", site_id,
                              "EMBED_ID", req.body.embed_id];
            request_one     = mysql.format(request_one, table_one);
            connection.query(request_one, function(err, result_roles) {
                // si jamais il y a une erreur ou bien que le tableau est vide, on retourne un status 400, 404
                if (err) {
                    res.status(400).send(err);
                } else if (result_roles.length == 0) {
                    res.status(404).send("Not Found");
                } else {
                  // une fois passé l'etape 1, on verifie de quel embed il s'agit, si jamais c'est un tableau ou bien autre chose qu'un tableau
                  var request_two = "SELECT * FROM ?? WHERE ?? = ?";
                  var table_two   = ["click_dash_base.click_Embed", "EMBED_ID", result_roles[0].EMBED_ID];
                  request_two     = mysql.format(request_two, table_two);
                  connection.query(request_two, function(err, result_embed_content_type) {
                      if (err) {
                          res.status(400).send(err);
                      } else {
                          // On build un JSON generique donner au client
                          var object           = {};
                          var count            = result_embed_content_type.length;
                          // Ici on dit si c'est un datatable, un tableau, ou bien un embed dont on ne connait pas la nature
                          object.datatable     = [];
                          object.tableau       = [];
                          object.others        = [];
                          // cette boucle permet
                          for (var i = 0; i < count; i++) {
                              if (result_embed_content_type[i].embed_content_type == 'datatable') {
                                  object.datatable.push(result_embed_content_type[i]);
                              }
                              else if (result_embed_content_type[i].embed_content_type == 'tableau') {
                                  object.tableau.push(result_embed_content_type[i]);
                              }
                              else {
                                  object.others.push(result_embed_content_type[i]);
                              }
                          }
                          // Un foreach pour recuperer que les donnée 'clean'
                          var values, result;
                          var object_final = []
                          // on nettoie les données inutiles
                          for (values in object) {
                            result = object[values];
                            if (result.length !== 0) {
                              for (var j = 0; j < result.length; j++) {
                                object_final.push(result[j]);
                              }
                            }
                          }
                          // On envoie au client les types d'embed pour qu'il puisse generer automatiquement les vues et renvoyer d'autres instructions
                          res.json(object_final);
                      }
                  })
                }
            })

        })

    // Nouvelle route pour menu
    router.route('/getMenu')
        .post(function(req, res) {
            var user_auth = req.body.user_auth;
            var site_id   = req.body.site_id;
            var query_one = "SELECT DISTINCT * FROM ?? WHERE ?? = ? AND ?? IN \
                            (SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ?) GROUP BY ??";
            var table_one = ["click_dash_base.click_menu_view", "SITE_ID", req.body.site_id, "VIEW_ID",
                             "VIEW_ID", "click_dash_base.click_embed_role_view", "SITE_ID", req.body.site_id, "ROLE_LIBELLE", req.body.user_auth, "VIEW_ID"];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, result) {
                if (err) {
                    res.status(400).send(err)
                } else {
                    res.json(result);
                }
            })
        })
    // Nouvelle route pour menu
    router.route('/getImgSite/:site_id')
        .get(function(req, res) {
            var query_one = "SELECT ??,?? FROM ?? WHERE ?? = ? LIMIT 1 ";
            var table_one = ["SITE_LOGO_TYPE","SITE_LOGO_BASE_64","click_dash_base.click_Site", "SITE_ID", req.params.site_id];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, result) {
                if (err) {
                    res.status(400).send(err)
                } else {
                     res.json(result);
                }
            })
        })

    // Permet de recuperer la route si jamais il y a plus de 1 tableau
    router.route('/getMultipleView/:view_id/:site_id')
        .get(function(req, res) {
            var query  = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
            var table  = ["click_dash_base.click_Embed", "VIEW_ID", req.params.view_id, "SITE_ID", req.params.site_id];
            query      = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(rows);
                }
            })
        })
    router.route('/getViewSite/:site/:role_id')
        .get(function(req, res) {
            var query        = "select a * from ?? WHERE ?? = ? AND ?? = ?";
            var table        = ['view_menu_auth_role', 'auth_user_role', req.params.role_id, 'site_id', req.params.site];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: err })
                } else {
                    res.json(rows);
                }
            })
        })
}
