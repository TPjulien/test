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
    router.route('/getViewSite/:site/:role_id/:customer_id')
        .get(function(req, res) {
            var auth_id      = "ai."        + req.params.role_id;
            var view_auth_id = "aei.embed_" + req.params.role_id;
            var query = "select vi.site_id,       \
                                vi.view_id,       \
                                vi.view_color,    \
                                vi.view_icon,     \
                                vi.view_label,    \
                                vi.view_position  \
                                FROM auth_info ai \
                                LEFT JOIN auth_embed_info aei ON ai.customer_id = aei.customer_id \
                                LEFT JOIN view_info vi        ON vi.view_id = aei.view_id         \
                                WHERE ?? = ??      \
                                AND ai.user_id = ? \
                                AND vi.site_id = ?;"
            // var query = "SELECT * from ?? WHERE ?? = ?";
            var table = [auth_id, view_auth_id, req.params.customer_id, req.params.site];
            // var table = ['view_info', 'site_id', req.params.site];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: "error"})
                } else {
                    res.json(rows);
                }
            })

        })
}
