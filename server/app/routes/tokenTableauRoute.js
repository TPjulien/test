var mysql       = require('mysql');
var PythonShell = require('python-shell');
var http        = require('http');
var http-post   = require('http-post');

module.exports = function(router, connection) {
    function getArgs(site, client) {
        var options = {
            mode: 'text',
            args: [site, client]
        }
        return options;
    };

    router.route('/getTicket')
        .post(function(req, res) {
            http.post('http://data.travelplanet.fr/trusted', { username: 'GuillaumeNaturel', target_site: 'anses'}, function(res) {
                response.setEncoding('utf8');
                res.on('data', function(chunk) {
                  console.log(chunk);
                })
            })
            // PythonShell.run('ticket.py', getArgs(req.body.site, req.body.username), function(err, results) {
            //     if (err)
            //         res.sendStatus(404, "unable to execute query");
            //     else
            //         res.json(results);
            // });
        })
}
