var mysql       = require('mysql');
var fs          = require('fs');
var cors        = require('cors');
var express     = require('express');
var bodyParser  = require('body-parser');
var jwt         = require('jsonwebtoken');
var https       = require('https');
var http        = require('http');
var passport    = require('passport');
var cassandra   = require('cassandra-driver');

require('dotenv').config({path: '/home/Prod/.env' });

var app = express();

var dbs = [ '192.168.1.233',
            '192.168.1.234',
            '192.168.1.235'];

/*var dbs = [ '192.168.1.118',
            '192.168.1.120',
            '192.168.1.121',
            '192.168.1.228',
            '192.168.1.229'];*/

var authProvider = new cassandra.auth.PlainTextAuthProvider('admin', '123soleil!');

var client = new cassandra.Client({ contactPoints: dbs, authProvider: authProvider });
client.connect(function(err) {
    if (err) {
        throw err;
    }
});

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
var connection;


function handleDisconnect() {
    connection = mysql.createConnection({
        host:     process.env.DB_HOST,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port:     process.env.DB_PORT,
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

var credentials = {
     key:                fs.readFileSync(process.env.SERV_API_KEY),
     cert:               fs.readFileSync(process.env.SERV_API_CERT),
     ca:                 fs.readFileSync(process.env.SERV_API_KEY_CHAIN),
     requestCert:        true,
     rejectUnauthorized: false
};

// app.use(cors({credentials: true}));
app.use(cors());

// options pour accepter tout !
app.use(bodyParser.urlencoded({ extended: true, limit: '1mb' }));
app.use(bodyParser.text({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ extended: true, limit: '1mb' }));
app.use(bodyParser.json({ limit: '1mb' }));

var port   = process.env.PORT || 3000;
var router = express.Router();

app.use(passport.initialize());
app.use(passport.session());

// debut des routes  ----------------------------------------------------------------------------------
// on n'a pas besoin de proteger la route d'authentification
// require('./app/routes/loginRoute')(router, connection, mysql);
require('./app/cassandraRoute/loginRoute') (router, client);
require('./app/routes/loginRoute')         (router, client);

// on verifie le token auth pour les autres routes
router.use(function(req, res, next) {
    // check header url if token exist
    var token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers.authorization;
    var removed_bearer = token.replace("Bearer ", '')
    // decoding the token
    if (token) {
        jwt.verify(removed_bearer, 'travelSecret', function(err, decoded) {
            if (err) {
                res.json({ success: false, message: 'Failed to authenticate token.' });
            } else {
                req.decoded = decoded;
                next();
            }
        });
    } else {
        // if no token has been send, show an error
        res.status(403).send("Forbidden");
    }
});

// require des routes nécesittant un token valide
require('./app/cassandraRoute/accountRoute') (router, client);
require('./app/routes/templateRoute')        (router, connection, mysql);
require('./app/routes/datatable')         (router, connection, mysql);
require('./app/routes/ipRoute')              (router, connection, mysql);
require('./app/routes/profilRoute')          (router, connection, mysql);
require('./app/routes/tableauRoute')         (router, connection, mysql);
require('./app/routes/email')                (router, connection, mysql);
require('./app/routes/workflow')             (router, connection, mysql);
require('./app/routes/aetmRoute')            (router, connection, mysql);
require('./app/cassandraRoute/selectRoute')  (router, client);
require('./app/routes/mailRoute')            (router);
require('./app/routes/busRoute')            (router, connection, mysql);


app.use('/api', router);

// ajouter exceptionnelement le preflight
app.options('/loginProfils', cors());

var httpServer  = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(5555);
httpsServer.listen(3254);
