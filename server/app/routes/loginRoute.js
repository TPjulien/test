var http      = require('http');
var mysql     = require('mysql');
var jwt       = require('jsonwebtoken');
var NodeRSA   = require('node-rsa');
var http_post = require('http-post');
var request   = require('request');
//var request   = request.defaults({jar: true});
var key       = new NodeRSA({b: 512});
var httpsRequest = require('https-request');
var pythonShell = require('python-shell');
var pyshell = new pythonShell('test.py');


request.defaults({jar: true});
var j = request.jar();

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

    function checkPwUser(login, pwd,site_id, callback) {
        var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
        var table = ["profils.view_tpa_connexion", "PWD", pwd, "Login", login,"SITE_ID",site_id];
        query     = mysql.format(query, table);
        connection.query(query, function(err, rows) {
            if (err) {
                callback(err, 404);
            } else {
                callback(null, rows);
            }
        })
    }


    // ancien login
    router.route('/login')
        .post (function (req, res) {
            getPassUser(req.body.username, function(err, data) {
                if (err) {
                    res.sendStatus(404, "user not found !");
                } else {
                    if (typeof data != "undefined" && data != null && data.length > 0) {
                        checkPwUser(req.body.username, req.body.password, req.body.SITE_ID, function(err, data) {
                            if (data) {
                              console.log(data.length);
                            } else {
                              console.log("data dont exist");
                            }
                            if (data.length != 0) {
                              var query = 'SELECT * FROM ?? WHERE ?? = ? AND ?? = ?';
                              var table = ['profils.view_info_userConnected','SITE_ID',req.body.SITE_ID,"Login",req.body.username ];
                              query     = mysql.format(query, table);
                              connection.query(query, function(error, info_result) {
                                  if (err) {
                                      res.sendStatus(404, "user not found");
                                  } else {
                                      var preToken = [{
                                          "SITE_ID":              info_result[0].SITE_ID,
                                          "UID":                  info_result[0].UID,
                                          "DEPOSITED_DATE":       info_result[0].DEPOSITED_DATE,
                                          "HomeCommunity":        info_result[0].HomeCommunity,
                                          "Login":                info_result[0].Login,
                                          "SITE_LIBELLE":         info_result[0].SITE_LIBELLE,
                                          "Customer_GivenName":   info_result[0].Customer_GivenName,
                                          "Customer_surName":     info_result[0].Customer_surName,
                                          "Role":                 info_result[0].Role,
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
        router.route('/verify/:Login/:SITE_ID')
          .post (function(req, res) {
              var query = "SELECT * from ?? WHERE ?? = ? AND ?? = ?";
              var table = ['profils.view_tpa_extensions_libelle', 'Login',req.params.Login, 'SITE_ID', req.params.SITE_ID];
              query     = mysql.format(query, table);
              connection.query(query, function(err, rows) {
                  if (err) {
                    res.status(400).send(err);
                  } else if (rows.length == 0) {
                      res.status(404).send("Not Found !");
                  } else {
                      res.json(rows);
                  }
              })
          })
        router.route('/SSO')
          .get (function(req, res) {
      	      pythonShell.run('test.py', function(err, result) {
      		  if (err)
      		      throw err;
      		  else {
      		      console.log(result[0]);
      		      res.send(result[0]);
      		  }
      	      })
      	  })
          .post (function(req, res) {
              request.post('https://e-travelmanagement22.amadeus.com/portalApp/', { form : { LOGINNAME: req.body.username,
                                                                                    SITE:       'Q4OZQ4OZ',
                                                                                    LANGUAGE:   'FR',
                                                                                    LOGIN_TYPE: 'SSO',
                                                                                    PASSWORD:   req.body.password,
                                                                                    BOOKING_FLOW_TYPE: 'MODIFY'
              }}, function(err, result, body) {
                  res.json(body);
              });
          })
        // permet de voir les communautés d'un utilisateur donné
        router.route('/loginProfils/:user')
          .get (function(req, res) {
              var query = "SELECT * FROM ?? WHERE ?? = ? GROUP BY ??";
              var table = ['profils.view_tpa_extensions_libelle', "Login", req.params.user, 'site_libelle'];
              query     = mysql.format(query, table);
              connection.query(query, function(err, rows) {
                  if (err)
                      res.status(400).send(err);
                  else
                      res.json(rows);
              })
          })
};
