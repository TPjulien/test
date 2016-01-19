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
                  // console.log(chunk);
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
