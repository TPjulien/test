var mysql = require('mysql');
var http_post = require('http-post');

module.exports = function(router, connection) {

    function getToken(user, site, length, callback) {
      for (i=0; i < (length - 1); i++) {
        http_post('http://data.travelplanet.fr/trusted', { username: user, target_site: site }, function(result) {
          console.log(result);
          // result.setEncoding('utf8');
          // result.on('data', function(chunk) {
          //         element.path  = chunk;
          //         element.info   = rows[i].path;
          //         element.length = "null";
          //         element.height = "null";
          //         element.width  = "null";
          //         element.name   = rows[i].name;
          //         final_object.push(element);
          //     })
          })
          callback(result, 200);
      }
    }


    router.route('/view/:user/:site')
        .get (function(req, res) {
            var element      = {};
            var final_object = [];
            var query = "SELECT * FROM ?? WHERE ?? = ?";
            var table = ['template_path', 'user', req.params.user];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error !'})
                } else {
                  getToken(req.params.user, req.params.site, function(err, data) {
                      console.log(data);
                  })
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
