var mysql = require('mysql');

module.exports = function(router, connection) {
    var table_password = "password";
    var table_username = "username";
    var table_login    = "login";



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

    function checkPwUser(login, pwd, callback) {
        var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
        var table = [table_login, table_password, pwd, table_username, login];
        query     = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                callback(err, 404);
            } else {
                callback(null, rows);
            }
        })
    }

    router.route('/login')
        .post (function (req, res) {
            getPassUser(req.body.username, function(err, data) {
                if (err) {
                    res.sendStatus(404, "user not found !");
                } else {
                    if (data.length > 0) {
                        checkPwUser(req.body.username, req.body.password, function(err, data) {
                            if (data != null) {
                                res.json(data);
                            } else {
                                res.sendStatus(404, "User not found")
                            }
                        });
                    } else {
                        res.sendStatus(404, "user not found !");
                    }
                }
            })
        })
};
