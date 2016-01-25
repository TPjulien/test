var mysql = require('mysql');
var http_post = require('http-post');
var request   = require('request');

module.exports = function(router, connection) {

    router.route('/view/:user/:site')
        .get (function(req, res) {
            var completed_requests = 0;
	    var second_requests = 0;
            var element      = {};
            var final_object = [];
            var query = "SELECT * FROM ?? WHERE ?? = ?";
            var table = ['template_path', 'user', req.params.user];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.json({ message: 'error !'})
                } else {
		  var token = [];
		  var info  = [];
		  var length = [];
		  var height = [];
		  var width = [];
		  var name  = [];
                  for (item in rows) {
                      request.post('http://data.travelplanet.fr/trusted', {form:{ username: req.params.user, target_site: req.params.site }}, function(err, resultat, body) {
			  info.push(rows[completed_requests].path);
			  token.push(body);
			  length.push("null");
			  width.push("null");
			  height.push(rows[completed_requests].height);
			  name.push(rows[completed_requests].name);
			  completed_requests++;
			  if (completed_requests == rows.length)
			      var afterResult = {};
			      var object_parsed = [];
			      for (getinfo in info) {
				  element.info  = info[getinfo];
				  element.token = token[getinfo];
				  element.length = length[getinfo];
				  element.width = width[getinfo];
				  element.name  = name[getinfo];
				  object_parsed.push(element);
				  second_requests++;
				  if(second_requests == (rows.length + 1)) {
				      res.json({info: info, token: token, width: width, length:length, name: name, height: height});
				  }
			      }
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
