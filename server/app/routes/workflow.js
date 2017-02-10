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
            var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? NOT LIKE ? ORDER BY ?? ";
            var table = ['alteryx.parameters','WORKFLOW_NAME',req.body.workflow,'TYPE','%ListBox%','TYPE'];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ? ORDER BY ??";
                    table = ['alteryx.parameters','WORKFLOW_NAME',req.body.workflow,'TYPE','ListBox','TYPE'];
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
            var table = ["VALUE", "alteryx.parameters","WORKFLOW_NAME",req.body.workflow,"TYPE","DropDown"];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(rows);
                }
            })
        })
    router.route('/dataList')
        .post(function(req, res) {
            var query = "SELECT * FROM ?? WHERE ?? = ? AND ?? = ?";
            var table = ["alteryx.parameters","WORKFLOW_NAME",req.body.workflow,"TYPE","ListBox"];
            query     = mysql.format(query, table);
            connection.query(query, function(err, rows) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.json(rows);
                }
            })
        })
    router.route('/query/:query')
        .get(function(req, res) {
            var query = req.params.query;
            // var table = ["alteryx.parameters","WORKFLOW_NAME",req.body.workflow,"TYPE","ListBox"];
            query     = mysql.format(query);
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
        		headers : { 'content-type' : 'application/json' },
        		url     : 'http://api-interne-test.travelplanet.fr/api/Alteryx/GenerateXmlParametersFile',
        		body    : req.body.workflow
        	    }
        	    request.post(options, function(err) {
        		if (err) {
        		    res.status(400).send(err);
        		} else {
        		    res.status(200).send("ok");
        		}
        	    })
        })
    router.route('/postWorkflow')
        .post(function(req, res) {
            var _body   = { 'json_data': req.body.json_data }
            var options = {
                headers : { 'content-type': 'application/json' },
                url     : "http://api-interne.travelplanet.fr/api/Alteryx/Workflow",
                body    : _body
            }
            request.post(options, function(err) {
                if (err) {
                    res.status(400).send(err);
                } else {
                    res.status(200).send("send");
                }
            })
        })
};
