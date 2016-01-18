var mysql = require('mysql');

module.exports = function(router, connection) {
    router.route('/test')
        .get (function(req, res) {
            res.json({ message: "hello ceci est une route avec un token obligatoire !"})
        })
}
