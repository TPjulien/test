var request      = require('request');
var zack         = require('../functions/zack_api.js');

module.exports = function(router, connection, mysql) {
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
}
