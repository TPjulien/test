var request   = require('request');

module.exports = function(router, connection, mysql) {
    router.route('/distinctWokflow')
        .get(function(req, res) {
            var query = "SELECT DISTINCT ?? FROM ??";
            var table = ['WORKFLOW_NAME','alteryx.parameters'];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(rows);
                }
            })
        })
    router.route('/infosWokflow')
        .post(function(req, res) {
            var query = "SELECT * FROM ?? WHERE ?? = ? ";
            var table = ['alteryx.workflows','NAME',req.body.workflow];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(rows);
                }
            })
        })
    router.route('/getParameters')
        .post(function(req, res) {
            var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? NOT LIKE ? ";
            var table = ['alteryx.parameters','WORKFLOW_NAME',req.body.workflow,'TYPE','%ListBox%'];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    query = "SELECT * FROM ?? WHERE ?? = ?";
                    table = ['alteryx.parameters','TYPE','ListBox'];
                    query     = mysql.format(query, table);
                    connection.query(query, function(err, rows_2) {
                        if (err) {
                            res.status(400).send(err);
                        } else {
                            res.send({'list': rows, 'listbox': rows_2});
                        }

                })
            }
        })
      })
    router.route('/banks')
        .post(function(req, res) {
            var query = "SELECT DISTINCT(??) FROM ?? WHERE ?? = ? AND ?? = ?";
            var table = ["VALUE", "alteryx.parameters","WORKFLOW_NAME",req.body.workflow,"TYPE","ListBox"];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(rows);
                }
            })
        })
    router.route('/workflow')
        .post(function(req, res) {
            var options = {
                uri : 'http://api-interne-test.travelplanet.fr/api/Alteryx/GenerateXmlParametersFile',
                method : 'POST',
                json : req.body.workflow
            };
            request(options, function(err, response) {
                if (response.statusCode == 200) {
                    res.status(200).send("Ok");
                } else {
                    res.status(400).send("bad request");
                }
            })
        })

};
