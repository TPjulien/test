var builder = require('../functions/builder.js');
var NodePbkdf2 = require('node-pbkdf2');
var bytes      = require('utf8-bytes');
var crypto     = require('crypto');
var cryptoJs   = require('crypto-js');
var uuid       = require('uuid/v4');
var jwt        = require('jsonwebtoken');

module.exports = function(router, client) {
  router.route('/pwd')
  .post(function(req, res) {
    if (req.body.password) {
      var randomUUID = uuid();
      randomUUID = randomUUID.replace(/-/g, '');
      var decryptedCrypto = crypto.pbkdf2Sync(req.body.password, randomUUID, 12000, 32, 'sha256').toString('base64');
      var iteration = new Buffer("12000").toString('base64');
      var finalPassword = randomUUID + decryptedCrypto.toString('base64') + iteration;
      res.send({result: finalPassword});
    } else {
      res.status(404).send("Password not found");
    }
  })
  router.route('/compare')
  .post(function(req, res) {
    query = "SELECT password FROM profils.user_profile WHERE user_id=? AND site_id=? LIMIT 1";
    table = [req.body.user_id, req.body.site_id];
    client.execute(query, table, function(err, result){
      if (err) {
        res.status("400").send(err);
      } else if (result.rows.length == 0) {
        res.status("404").send("Not found");
      } else {
        var passwdGuess = result.rows[0].password;
        var hashGuess   = "";
        var iteration   = "";
        i = 0
        while (i < passwdGuess.length) {
          if (i >= 0 && i < 32) {
            hashGuess += passwdGuess[i];
          }
          if (i >= 76) {
            iteration += passwdGuess[i];
          }
          i++;
        }
        intIteration = new Buffer(iteration, 'base64');
        intIteration = intIteration.toString();
        var decryptedCrypto = crypto.pbkdf2Sync(req.body.password, hashGuess, parseInt(intIteration), 32, 'sha256').toString('base64');
        var finalPassword = hashGuess + decryptedCrypto.toString('base64') + iteration;
        if (finalPassword === passwdGuess) {
          var preToken = [{
            "site_id"    : req.body.site_id,
            "UID"        : req.body.user_id,
            "username"   : req.body.username,
            "can_logout" : true,
            "is_saml"    : false
          }];
          var token = jwt.sign(preToken, 'travelSecret', {
            expiresIn: 7200
          });
          res.json({ 'token' : token });
        } else {
          res.status(401).send("");
        }
      }
    })
  })
  router.route('/comSelect')
  .post(function(req, res) {
    var tabIn    = req.body.tabIn;
    var values   = req.body.values;
    var request  = "SELECT js_data, id FROM click.table1 WHERE type=? AND key=? AND id IN (";
    var table = []
    for (var keyTab in tabIn) {
      if (tabIn.hasOwnProperty(keyTab)) {
        table.push("'" + tabIn[keyTab] + "'", ",");
      }
    }
    table.pop()
    table.push(")");
    table = request + " " + table.join(' ');
    client.execute(table, values, function(err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.json(result.rows);
      }
    })
  })
  router.route('/sign/:table/:database?')
  .post(function(req, res) {
    var databaseName = null;
    if (req.params.database) {
      databaseName = req.params.database;
    } else {
      databaseName = "click";
    }

    var getRequest = builder.selectBuilder(req.params.table, req.body.selected, req.body.parameters, databaseName);
    client.execute(getRequest.query, getRequest.values, function(err, result) {
      if (err) {
        res.status(400).send(err);
      } else {
        res.send(result.rows);
      }
    })
  })

  // nouvelle version du saml
  router.route('/samlLogin')
  .post(function(req, res) {
    field  = req.body.field;
    name   = req.body.username.match(/^([^@]*)@/)[1];
    siteID = req.body.siteID;
    if (siteID.length == 8) {
      siteID = siteID.slice(0, 4);
    }
    query = "SELECT * FROM profils.user_lookup WHERE key_name=? AND key_value=? AND site_id=?";
    table = ["login", name, siteID];

    client.execute(query, table, function(err, rows) {
      if (err) {
        res.status(400).send(err);
      } else {
        var preToken = [{
          "site_id"    : rows.rows[0].site_id,
          "UID"        : rows.rows[0].user_id,
          "username"   : name,
          "can_logout" : false,
          "is_saml"    : true
        }];
        var token = jwt.sign(preToken, 'travelSecret', {
          expiresIn: 7200
        });
        res.json({ 'token' : token });
      }
    })
  })
}
