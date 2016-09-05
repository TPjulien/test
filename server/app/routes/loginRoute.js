var http         = require('http');
var mysql        = require('mysql');
var jwt          = require('jsonwebtoken');
var NodeRSA      = require('node-rsa');
var http_post    = require('http-post');
var request      = require('request');
var key          = new NodeRSA({b: 512});
var httpsRequest = require('https-request');
var pythonShell  = require('python-shell');
var cors         = require('cors')
// ajout de la stratégie saml shibboleth, pour one-login
var SamlStrategy = require('passport-saml').Strategy;
var passport     = require('passport');
var fs           = require('fs');

module.exports = function(router, connection) {
    var table_password = "user_password";
    var table_username = "username";
    var table_login    = "user_info";


    // shibboleth
    passport.use(new SamlStrategy(
      {
        callbackUrl  : 'https://tp-control.travelplanet.fr:3254/api/Shibboleth.sso/SAML2/POST',
        entryPoint   : 'https://test.federation.renater.fr/idp/profile/SAML2/Redirect/SSO',
        issuer       : 'https://tp-control.travelplanet.fr/#/account/login',
        decryptionPvk : fs.readFileSync('/etc/ssl/tp_control/tp-control_travelplanet_fr.crt', 'utf8')
        // cert         : fs.readFileSync('/etc/ssl/tp_control/tp-control_travelplanet_fr.crt', 'utf-8')
      },
      function(profile, done) {
          var query = "";
          var table = [];
          return done(null, profile);
          })
    )


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

    // router.route('/shibboleth')
    //   .get(passport.authenticate('saml', { failureRedirect: '/'  }),
    //       function (req, res) {
    //         res.status(200).send('ça fonctionne !');
    //   });
    // test

    router.route('/Shibboleth.sso/SAML2/POST')
        .post (passport.authenticate('saml', { failureRedirect: '/'}),
            function (req, res) {
                var result = req.body.displayName;
                console.log(result);
                res.status(200).send( { result[0] } );
        });

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
                              console.log("data exist");
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
                                          "site_id":              info_result[0].SITE_ID,
                                          "UID":                  info_result[0].UID,
                                          "DEPOSITED_DATE":       info_result[0].DEPOSITED_DATE,
                                          "home_community":       info_result[0].HomeCommunity,
                                          "username":             info_result[0].Login,
                                          "company":              info_result[0].SITE_LIBELLE,
                                          "firstname":            info_result[0].Customer_GivenName,
                                          "lastname":             info_result[0].Customer_surName,
                                          "user_auth":            "Administrator"
                                          // bug de roles
                                          // "user_auth":            info_result[0].Role,
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
        // route de shibboleth
        router.route('/shibboleth')
          .get(passport.authenticate('saml', { failureRedirect: '/'  }),
              function (req, res) {
                res.status(200).send('ça fonctionne !');
          });

        // router.route('/Shibboleth.sso/SAML2/POST')
        //   .post (function(req, res) {
        //         res.status(200).send(req.body);
        //   });

        // login normal travel planet
        router.route('/loginCheck/:user')
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

        // route pour aetm
        router.route('/aetmConnect')
          .post (function(req, res) {
              var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
              var table = ['tp_control.Aetm_WIP', 'SITE_ID', req.body.site_id, 'user', req.body.username];
              query     = mysql.format(query, table);
              connection.query(query, function(err, result) {
                  if (err)
                      res.status(400).send(err);
                  else
                      res.json(rows);
              })
          })
};
