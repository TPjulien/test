var mysql       = require('mysql');
var fs          = require('fs');
var cors        = require('cors');
var express     = require('express');
var bodyParser  = require('body-parser');
var http        = require('http');
var passport    = require('passport');

require('dotenv').config({path: '/home/Prod/.env' });

var app = express();

var connection;


function handleDisconnect() {
    connection = mysql.createConnection({
        host:     "localhost",
        user:     "test",
        password: "test",
        database: "test",
        port:     3306,
        debug:    true
    });

    connection.connect(function(err) {
        if (err) {
            setTimeout(handleDisconnect, 2000);
        }
    });

    connection.on('error', function(err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();


// options pour accepter tout !
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.text({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));

var port   = process.env.PORT || 3000;
var router = express.Router();

// debut des routes  ----------------------------------------------------------------------------------
// on n'a pas besoin de proteger la route d'authentification
// require('./app/routes/loginRoute')(router, connection, mysql);

// on verifie le token auth pour les autres routes

// require des routes nécesittant un token valide
require('./app/routes/query-route')         (router, connection, mysql);

app.use('/api', router);


var httpServer  = http.createServer(app);

httpServer.listen(port);
