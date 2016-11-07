var request = require('request');
var mysql   = require('mysql');
var zack    = require('./zack_api.js');
module.exports = {
  // nouvelle version du password checker
  checkPwUser: function(login, pwd, site_id, callback) {
    var query = "SELECT * FROM view_tpa_connexion WHERE LOGIN='" + login +  "' AND SITE_ID='" + site_id + "'";
    request.post(zack.returnOptions(query, 'profils', 'PWD'), function(err, result, body) {
      if (err){
      callback(err, 404);
    }else {
        var body_parsed = JSON.parse(body);
        if(body_parsed.length != 0) {
          if (body_parsed[0].PWD != pwd) {
              callback("not match", 400);
          } else {
              callback(null, body_parsed);
          }
        } else {
            callback("not match", 400);
        }
      }
    })
  }
}
