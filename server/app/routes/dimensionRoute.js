var mysql = require('mysql');

module.exports = function(router, connection) {
    // affichage de la vue du site disponible pour l'utilisateur connecté
    router.route('/getViewSite/:site/:role_id')
        .get(function(req, res) {
            var auth_id      = "ai."        + req.params.role_id;
            var view_auth_id = "aei.embed_" + req.params.role_id;
            var query        = "select DISTINCT * from ?? WHERE ?? = ? AND ?? = ?";
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
