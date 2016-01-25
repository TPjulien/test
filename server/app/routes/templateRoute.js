var mysql = require('mysql');
var http_post = require('http-post');

module.exports = function(router, connection) {

    function getTokens(user, site, length, callback) {
        var element      = {};
        var final_object = [];
        for (i=0; i < (length - 1); i++) {
          http_post('http://data.travelplanet.fr/trusted', { username: user, target_site: site }, function(result) {
            result.setEncoding('utf8');
            result.on('data', function(chunk) {
                    element.path  = chunk;
                    element.info   = rows[i].path;
                    element.length = "null";
                    element.height = "null";
                    element.width  = "null";
                    element.name   = rows[i].name;
                    final_object.push(element);
                })
            }
        }
        callback(final_object, 404);
        // var query = "SELECT ?? FROM ?? WHERE ?? = ?";
        // var table = [table_password, table_login, table_username, loginUser];
        // query     = mysql.format(query, table);
        // connection.query(query, function(err, rows) {
        //     if (err) {
        //         callback(err, 404);
        //     } else {
        //         callback(null, rows);
        //     }
        // })
    }


    router.route('/view/:user/:site')
        .get (function(req, res) {
            var query = "SELECT * FROM ?? WHERE ?? = ?";
            var table = ['template_path', 'user', req.params.user];

            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error !'})
                } else {
                    getTokens(req.params.user, req.params.site, function(err, data) {
                        console.log(data);
                    });
                    // for (i=0; i < (rows.length - 1); i++) {
                    //
                  	// 		// res.json(final_object);
                    // })
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
