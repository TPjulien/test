var mysql       = require('mysql');

module.exports = function(router, connection) {
    router.route('/getDimension/:user')
        .get(function(req, result) {
            var query = "SELECT * from ?? WHERE ?? = ?";
            var table = ['dimension', 'user', req.params.user];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error'})
                } else {
                    res.json(rows);
                }
            })
        })
    router.route('/getOneDimension/:user/:view')
        .get(function(req, res) {
            var query = "SELECT * from ?? WHERE ?? = ? AND ?? = ?";
            var table = ['dimension', 'user', req.params.user, 'name', req.params.view];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error'})
                } else {
                    res.json(rows);
                }
            });
        })
    router.route('/getViewSite/:site/:role_id')
        .get(function(req, res) {
            var auth_id      = "ai."        + req.params.role_id;
            var view_auth_id = "aei.embed_" + req.params.role_id;
            var query        = "select * from ?? WHERE ?? = ? AND ?? = ?";
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
    router.route('/testSite/:site_id/:username')
        .get(function(req, res) {
            // premiere requete pour reconnaitre les utilisateurs
            // "view_menu_user_info"
            var query_one = "SELECT ?? as result FROM ?? WHERE ?? =?";
            var table_one = ['user_id', 'user_info', 'username', req.params.username];
            query_one = mysql.format(query_one, table_one);
            connection.query(query_one, function(err, rows_one) {
                if (err)
                    res.status(400).send("bad realm !");
                else
                    //
                    var id_result = rows_one[0].result;
                    var query_two = "SELECT ?? as result FROM ?? WHERE ?? = ? and ?? = ?";
                    var table_two = ['role_type', 'auth_role_info', 'user_id', req.params.id_result, 'site_id', req.body.site_id];
                    query_two     = mysql.format(query_one, table_one);
                    connection.query(query_two, function(err, rows_two) {
                        if (err)
                            res.status(400).send("bad realm !");
                        else
                            var result_roles = rows_two[0].result;
                            res.json(result_roles);
                            // for (update)
                    })
            })
            // var query        = "select * from ?? WHERE ?? = ? AND ?? = ?";
            // var table        = ['view_menu_auth_role', 'auth_user_role', req.params.role_id, 'site_id', req.params.site];
            // query     = mysql.format(query, table);
            // connection.query(query, function(err, rows) {
            //     if (err) {
            //         res.json({ message: err })
            //     } else {
            //         res.json(rows);
            //     }
            // })
        })
}
