var mysql       = require('mysql');
var PythonShell = require('python-shell');
var http        = require('http');
var http_post   = require('http-post');

module.exports = function(router, connection) {
    function getArgs(site, client) {
        var options = {
            mode: 'text',
            args: [site, client]
        }
        return options;
    };

    router.route('/getTicket')
        .post(function(req, result) {
            http_post('http://data.travelplanet.fr/trusted', { username: req.body.username, target_site: req.body.site }, function(res) {
                res.setEncoding('utf8');
                res.on('data', function(chunk) {
                  result.json(chunk);
                })
            })
        })
}
