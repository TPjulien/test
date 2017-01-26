var fs           = require('fs');
var jwt          = require('jsonwebtoken');
var token        = require('../functions/token.js');
var passport     = require('passport');
var password     = require('../functions/password.js');
var SamlStrategy = require('passport-saml').Strategy;
var request      = require('request');
var zack         = require('../functions/zack_api.js');
require('dotenv').config({path: '/home/Preprod/.env' });

module.exports = function(router, connection, mysql) {
  var saml_data             = [];
  var saml_data_not_crypted = [];
  // serialize user
  var field                 = [];
  var siteID                = [];
  var shib_url              = [];
  var shib_url_logout       = [];
  var shib_issuer           = [];
  var shib_user_id          = [];
  var login                 = [];

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  // deserialize user
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });

  // shibboleth
  function saml(shib_url, shib_url_logout, shib_issuer, shib_user_id, click_login) {
    var get_strategy = new SamlStrategy(
      {
          callbackUrl       : process.env.SAML_CALLBACK_URL,
          entryPoint        : shib_url,
          issuer            : shib_issuer,
          decryptionPvk     : fs.readFileSync(process.env.SERV_KEY, 'utf8'),
          privateCert       : fs.readFileSync(process.env.SERV_KEY, 'utf-8'),
          //authnContext : false,
	  //cert              : fs.readFileSync(process.env.RENATER_CRT, 'utf-8'),
          logoutUrl         : shib_url_logout,
	  disableRequestedAuthnContext : true,
	  //authnRequestBinding : 'HTTP-POST',
	  //identifierFormat  : 'urn:oasis:names:tc:SAML:2.0:nameid-format:entity',
          identifierFormat  : 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
          logoutCallbackUrl : process.env.SAML_CALLBACK_URL
      } ,
      function(profile, done) {
        var table = {};
        table.uid                 = profile['urn:oid:0.9.2342.19200300.100.1.1'];
        table.affiliations        = profile['urn:oid:1.3.6.1.4.1.5923.1.1.1.1'];
        table.primary_affiliation = profile['urn:oid:1.3.6.1.4.1.5923.1.1.1.5'];
        table.surname             = profile['urn:oid:2.5.4.4'];
        table.email_affiliations  = profile['urn:oid:1.3.6.1.4.1.5923.1.1.1.9'];
        table.mail                = profile['urn:oid:0.9.2342.19200300.100.1.3'];
        table.eppn                = profile['urn:oid:1.3.6.1.4.1.5923.1.1.1.6'];
        table.etablissement       = profile['urn:oid:1.3.6.1.4.1.7135.1.2.1.14'];
        table.given_name          = profile['urn:oid:2.5.4.42'];
        table.common_name         = profile['urn:oid:2.5.4.3'];
        table.display_name        = profile['urn:oid:2.16.840.1.113730.3.1.241'];
        table.nameID              = profile.nameID;
        table.nameIDFormat        = profile.nameIDFormat;
        table.sessionIndex        = profile.sessionIndex;
        table.nameQualifier       = profile.nameQualifier;
        table.spNameQualifier     = profile.spNameQualifier;
        table.isSaml              = true;
        table.ssoId               = table[field];
        table.login               = click_login;
      	table.siteID              = siteID;
      	table.userID              = shib_user_id;
	  var token = jwt.sign(table, 'travelSecret', {
          expiresIn: 7200
        });
        saml_data_not_crypted = table;
        saml_data             = token;
	console.log("resultat", table);
        return done(null, token);
      })
      passport.use(get_strategy);
    }

    router.route('/redirect')
    .get(function(req, res) {
      //  callback du saml
      res.redirect("https://click.travelplanet.fr/#/SAML/" + saml_data);
    });

    router.route('/Shibboleth.sso/SAML2/POST')
    .post (passport.authenticate('saml', {
      samlFallBack: 'login-request',
      samlBinding : 'HTTP-POST',
      failureRedirect: '/error',
      successRedirect: '/redirect'
    }),
    function (err, req, res) {
      if(err) {
        res.status(400).send(err);
      }
    });

    router.route('/error')
    .get(function(req, res) {
      res.status(400).res("une erreur est survenue");
    });

    router.route('/Shibboleth.sso/Logout')
    .get(function(req, res) {
      req.user = [];

      req.user.nameID          = saml_data_not_crypted.nameID;
      req.user.nameIDFormat    = saml_data_not_crypted.nameIDFormat;
      req.user.sessionIndex    = saml_data_not_crypted.sessionIndex;
      req.user.spNameQualifier = saml_data_not_crypted.spNameQualifier;
      req.user.nameQualifier   = saml_data_not_crypted.nameQualifier;
      saml.logout(req, function(err, requestUrl) {
        if (err) {
          res.status(400).send(err);
        } else {
          res.json(requestUrl);
        }
      });
    })

  //   router.route('/samlLogin')
  //   .post(function(req, res) {
  //     var mail            = req.body.data.mail;
  //
  //     // à modifier apres lyon 3 (probleme d'id)
  //     var query_one       = "SELECT SITE_ID, LOGOUT_SAML_URL, UID, LOGIN FROM ?? WHERE ?? = ? AND (?? = ? OR ?? = ?)";
  //     var table_one       = ['profils.saml', 'ENTRY_SAML_URL', req.body.data.nameQualifier, "LOGIN", mail, "SAML_ID", mail];
  //     query_one     = mysql.format(query_one, table_one);
	// connection.query(query_one, function(err, result_one) {
  //       if(err) {
  //           res.status(400).send(err);
  //       } else if (result_one.length == 0) {
  //           res.status(404).send("Not found !");
  //       } else {
  //         token.generate_token('UID', result_one[0].UID, result_one[0].SITE_ID, false, true, req, res, connection);
  //       }
  //     })
  //   });
    // on verifie s'il est éligible au samlCheck
    router.route('/samlCheck')
    .post (function (req, res) {
      var query = "SELECT ?? FROM ?? WHERE ?? = ?";
      var table  = ['SAML_TYPE', 'profils.saml', 'SITE_ID', req.body.SITE_ID];
      query = mysql.format(query, table);
      connection.query(query, function(err, result) {
        if (err) {
            res.status(400).send(err);
        } else {
            res.json(result);
        }
      })
    })
    // mise à jour du login
    router.route('/login')
    .post (function (req, res) {
      password.checkPwUser(req.body.username, req.body.password, req.body.SITE_ID, function(err, data) {
        // dans le cas ou on a une erreur
        if (err) {
            res.status(401).send("Bad credential");
        } else if (data.length != 0) {
            token.generate_token('Login', req.body.username, req.body.SITE_ID, true, false, req, res, connection);
        } else {
          res.status(400).send("user not found");
        }
      });
    });

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

    router.route('/setup')
    .post(function(req, res) {
        shib_url        = req.body.url;
        shib_url_logout = "";
        shib_issuer     = req.body.issuer;
        field           = req.body.field;
	siteID          = req.body.siteID;
	user_id         = req.body.user_id;
        saml(shib_url, shib_url_logout, shib_issuer, user_id, req.body.login);
        res.status(200).send("setup completed");
    })

    // route de shibboleth
    router.route('/shibboleth/:login')
    .get(function (req, res) {
      var query = "SELECT DISTINCT ??, ??, ?? FROM ?? WHERE ?? = ?";
      var table = ['SITE_ID', 'ENTRY_SAML_URL', 'LOGOUT_SAML_URL', 'profils.saml', 'LOGIN', req.params.login];
      query     = mysql.format(query, table);
      connection.query(query, function(err, rows) {
        if (err) {
            res.status(400).send(err);
        } else if (rows.length == 0) {
            res.status(404).send("Not saml configured");
        } else {
          //shib_url    = rows[0].ENTRY_SAML_URL;
          var sso_idp = rows[0].ENTRY_SAML_URL.split('/');
          shib_url    = "https://" + sso_idp[2] + '/idp/profile/SAML2/Redirect/SSO';
          if (rows[0].LOGOUT_SAML_URL == null) {
              shib_url_logout = shib_url
          } else  {
              shib_url_logout = rows[0].LOGOUT_SAML_URL;
          }
          saml(shib_url, shib_url_logout);
          res.redirect('/postShibboleth');
        }
      })
    })

    router.route('/postShibboleth')
    .get(passport.authenticate('saml', { failureRedirect: '/' }),
    function (req, res) {
      res.status(200).send('Shib succeded');
    });

    // login normal travel planet
    router.route('/loginCheck/:user')
    .get (function(req, res) {
      // premiere requete
      var query = "SELECT * FROM ?? WHERE ?? = ?";
      var table = ['profils.view_tpa_extensions_libelle', "Login", req.params.user];
      query     = mysql.format(query, table);
      connection.query(query, function(err, rows) {
        if (err) {
            res.status(400).send(err);
        } else {
          if (rows.length == 1) {
            var query_two = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
            var table_two = ['profils.saml', 'SITE_ID', rows[0].SITE_ID, 'LOGIN', req.params.user];
            query_two     = mysql.format(query_two, table_two);
            connection.query(query_two, function(err, rows_two) {
              if (err) {
                  res.status(400).send(err);
              } else {
                  res.json({'tpa': rows, 'saml': rows_two})
              }
            })
          } else {
              res.json(rows);
          }
        }
      })
    })

    // route pour aetm
    router.route('/aetmConnect/:uid/:site_id')
    .get (function(req, res) {
      var query = "SELECT * FROM profils.view_0_Aetm WHERE UID ='" + req.params.uid + "' AND SITE_ID ='" + req.params.site_id + "' LIMIT 1";
      request.post(zack.returnOptions(query, 'profils', 'PWD'), function(err, result, body) {
        if (err) {
            res.status(400).send(err);
        } else {
          var body_parsed = JSON.parse(body);
          res.json(body_parsed);
        }
      })
    })
  };
