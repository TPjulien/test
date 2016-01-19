var mysql       = require('mysql');
var PythonShell = require('python-shell');

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
            PythonSell.run('ticket.py', getArgs(req.body.site, req.body.username), function(err, results) {
                if (err)
                    res.sendStatus(404, "unable to execute query");
                else
                    res.json(results);
            });
        })
}
