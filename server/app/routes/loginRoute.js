var mysql   = require('mysql');
var jwt     = require('jsonwebtoken');
var NodeRSA = require('node-rsa');
var key     = new NodeRSA({b: 512});

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
                console.log("hello !")
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
                    if (typeof data != "undefined" && data != null && data.length > 0) {
                        checkPwUser(req.body.username, req.body.password, function(err, data) {
                            if (data) {
                              console.log(data.length);
                            } else {
                              console.log("data dont exist");
                            }
                            if (data.length != 0) {
                              var query = 'SELECT * from ?? where ?? = ?';
                              var table = ['user_info', 'username', data[0].username];
                              query     = mysql.format(query, table);
                              connection.query(query, function(error, info_result) {
                                  if (err) {
                                      res.sendStatus(404, "user not found");
                                  } else {
                                      var preToken = [{
                                          "username":       data[0].username,
                                          "site":           data[0].site,
                                          "firstname":      info_result[0].firstname,
                                          "lastname":       info_result[0].lastname,
                                          "company":        info_result[0].company,
                                          "favorite_color": info_result[0].favorite_color,
                                          "logo":           info_result[0].logo
                                      }];
                                      var token = jwt.sign(preToken, 'travelSecret', {
                                          expiresIn: 1400
                                      });
                                      res.json({
                                        token: token
                                      });
                                  }
                              })
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
