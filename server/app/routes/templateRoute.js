var mysql = require('mysql');
var http_post = require('http-post');
var request   = require('request');

module.exports = function(router, connection) {

    router.route('/view/:user/:site')
        .get (function(req, res) {
            var completed_requests = 0;
            var element      = {};
            var final_object = [];
            var query = "SELECT * FROM ?? WHERE ?? = ?";
            var table = ['template_path', 'user', req.params.user];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error !'})
                } else {

                  for (i = 0; i <= rows.length; i++) {
                      request.post({url: 'http://data.travelplanet.fr/trusted', { use,rname: req.params.user, target_site: req.params.site }}, function(err, body) {
                          console.log(body);
                      });
                      // http.post('http://data.travelplanet.fr/trusted', { use,rname: req.params.user, target_site: req.params.site }, function(res) {
                      //     console.log(res.body);
                      // });
                      // http_post('http://data.travelplanet.fr/trusted', { username: req.params.user, target_site: req.params.site }, function(result) {
                      // result.setEncoding('utf8');
                      // result.on('data', function(chunk) {
                      //     element.token  = chunk;
                      //     element.info   = item.path;
                      //     element.length = "null";
                      //     element.height = "null";
                      //     element.width  = "null";
                      //     element.name   = item.name;
                      //     final_object.push(element);
                      //     // completed_requests++;
                      //     })
                      // })
                    }
                  }
            })
        })

    // get only one
    router.route('/templateUSer/:user/:id')
        .get (function(req, res) {
            var query = "SELECT * from ?? WHERE ?? = ? AND ?? =?";
            var table = ['template_path', 'user', req.params.user, 'id', req.params.id];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error'})
                } else {
                    res.json(rows);
                }
            })
        });
}
