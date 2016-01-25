var mysql = require('mysql');

module.exports = function(router, connection) {

    function getPassUser(loginUser, callback) {
        var query = "SELECT ?? FROM ?? WHERE ?? = ?";
        var table = [table_password, table_login, table_username, loginUser];
        query     = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                callback(err, 404);
            } else {
                callback(null, rows);
            }
        })
    }


    router.route('/view/:user/:site')
        .get (function(req, res) {
            var element      = {};
            var final_object = [];
            var query = "SELECT * FROM ?? WHERE ?? = ?";
            var table = ['template_path', 'user', req.params.user];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error !'})
                } else {
                    for (i=0; i <= rows.length; i++) {
                      http_post('http://data.travelplanet.fr/trusted', { username: req.params.user, target_site: req.params.site }, function(result) {
                        result.setEncoding('utf8');
                        result.on('data', function(chunk) {
                                element.token  = chunk;
                                element.path   = rows[0].path;
                                element.length = "null";
                                element.height = "null";
                                element.width  = "null";
                                element.name   = rows[0].name;
                                final_object.push(element);
                          // result.json(chunk);
                        })
                        res.json(final_object);
                    })
                    // res.json(rows);
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
