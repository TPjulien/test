var mysql   = require('mysql');
var jwt     = require('jsonwebtoken');
var NodeRSA = require('node-rsa');
var key     = new NodeRSA({b: 512});

module.exports = function(router, connection) {
    var table_password = "user_password";
    var table_username = "username";
    var table_login    = "user_info";

    function getPassUser(loginUser, callback) {
        var query = "SELECT ?? FROM ?? WHERE ?? = ? AND ?? = ?";
        var table = [table_password, table_login, table_username, loginUser, "isActivated", 1];
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
                    if (typeof data != "undefined" && data != null && data.length > 0) {
                        checkPwUser(req.body.username, req.body.password, function(err, data) {
                            if (data) {
                              console.log(data.length);
                            } else {
                              console.log("data dont exist");
                            }
                            if (data.length != 0) {
                              var query = 'SELECT ??, ??, \
                                           ??, ??, \
                                           ??, ??, \
                                           ??, ??  \
                                           FROM  ?? ??, ?? ?? \
                                           WHERE ?? = ? \
                                           AND ?? = ?? AND ti.tableau_user_id IS NOT NULL';
                              var table = ['si.site_id'         , 'si.customer_id',
                                           'si.site_logo'       , 'si.site_tableau_libelle',
                                           'si.site_label'      , 'si.site_color_theme',
                                           'ti.tableau_user_id' , 'si.site_background_theme',
                                           'tableau_info'       , 'ti',
                                           'site_info'          , 'si',
                                           'si.customer_id'     , data[0].customer_id,
                                           'si.site_id'         , 'ti.site_id'];
                              query     = mysql.format(query, table);
                              connection.query(query, function(error, info_result) {
                                  if (err) {
                                      res.sendStatus(404, "user not found");
                                  } else {
                                      var preToken = [{
                                          "username":            data[0].username,
                                          "tableau_user_id":     info_result[0].tableau_user_id,
                                          "site":                info_result[0].site_tableau_libelle,
                                          "logo":                info_result[0].site_logo,
                                          "customer_id":         info_result[0].customer_id,
                                          "site_id":             info_result[0].site_id,
                                          "firstname":           data[0].user_first_name,
                                          "lastname":            data[0].user_last_name,
                                          "company":             info_result[0].site_label,
                                          "favorite_color":      info_result[0].site_color_theme,
                                          "favorite_background": info_result[0].site_background_theme,
                                          "user_id":             data[0].user_id,
                                          "user_auth":           data[0].user_auth
                                      }];
                                      var token = jwt.sign(preToken, 'travelSecret', {
                                          expiresIn: 7200
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
        router.route('/verify')
          .post (function(req, res) {
              var query = "SELECT ??,?? from ?? WHERE ?? = ?";
              var table = ['user_last_name', 'user_first_name', 'user_info', 'username', req.body.username];
              query     = mysql.format(query, table);
              connection.query(query, function(err, rows) {
                  if (err) {
                    res.status(400).send("Bad realm !");
                  } else if (rows.length == 0) {
                      res.status(404).send("Not Found !");
                  } else {
                      res.json(rows);
                  }
              })
          })
};
